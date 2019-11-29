// 处理用户缓存数据

'use strict';

const { randString } = require('egg-sachikawa').Utils;

const curVersion = 0;
const expireTime = 3600 * 24 * 7;

function getKey(token) {
  return 'g:' + token;
}

module.exports = app => {
  const redis = app.redis.get('main');
  const db = app.mainDB;
  class MyService extends app.Service {
    // 通过token获取用户信息
    async get(token, forceUpdate = false) {
      const key = getKey(token);
      const raw = await redis.get(key);
      if (raw) {
        let data = JSON.parse(raw);
        if (forceUpdate || data.v < curVersion) {
          data = await this.create(data.userid);
          await redis.setex(key, expireTime, JSON.stringify(data));
        } else {
          await redis.expire(key, expireTime);
        }
        return data;
      }
      return {
        userid: -1,
        name: 'unknown',
        nick: 'anonymous',
        permissions: [],
        v: curVersion,
      };
    }
    // 确认用户是否具备相应权限
    checkPermission(userdata, permission) {
      return permission === true || userdata.permissions.indexOf(permission) >= 0;
    }
    // 重新获取用户信息
    async update(token) {
      const data = await this.get(token, true);
      return data.userid >= 0;
    }
    // 添加用户信息
    async add(userid) {
      const data = await this.create(userid);
      const token = `${userid}#${randString()}`;
      const oldToken = await this.getToken(userid);
      if (oldToken) await this.remove(oldToken);
      await redis.setex(getKey(token), expireTime, JSON.stringify(data));
      return { token, data };
    }
    // 获取用户token
    async getToken(userid) {
      const keys = await redis.keys(`g:${userid}#*`);
      return (keys.length > 0) ? keys[0].substring(2) : null;
    }
    // 清除用户信息
    async remove(token) {
      await redis.del(getKey(token));
    }
    // 创建用户信息
    async create(id) {
      const user = await db.Users.simpleFindOne({ id });
      if (!user) throw new Error('无效的用户');
      return {
        userid: user.id,
        name: user.name,
        nick: user.nick,
        permissions: user.permissions,
        v: curVersion,
      };
    }
  }
  return MyService;
};
