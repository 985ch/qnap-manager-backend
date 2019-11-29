// 处理用户缓存数据

'use strict';

const crypto = require('crypto');

module.exports = app => {
  const errCode = app.errCode;
  const db = app.mainDB;
  class MyService extends app.Service {
    // 用户登陆
    async login(name, password) {
      const user = await db.Users.simpleFindOne({ name }, [ 'id', 'password', 'salt' ]);
      if (!user) this.ctx.throwFail('用户不存在', errCode.INVAILD_USER);
      const md5 = crypto.createHash('md5').update(password + user.salt).digest('hex');
      if (md5 !== user.password) this.ctx.throwFail('密码错误', errCode.INVAILD_PASSWORD);

      // TODO：生成登陆记录
      const result = await this.service.user.cache.add(user.id);
      return result;
    }
  }
  return MyService;
};
