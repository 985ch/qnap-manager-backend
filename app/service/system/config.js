// 系统配置管理

'use strict';
const _ = require('lodash');

module.exports = app => {
  const db = app.mainDB;
  class MyService extends app.Service {
    // 获取所有系统配置
    async listAll() {
      const raws = await db.SystemConfig.simpleFind();
      const json = this.coll2json(raws);
      json.archive_server.key = '';
      return json;
    }
    // 把查询结果转换成为对象
    coll2json(raws) {
      const configs = {};
      for (const obj of raws) {
        configs[obj.name] = obj.value;
      }
      return configs;
    }
    // 获取特定的配置
    async get(name) {
      if (_.isArray(name)) {
        const raws = await db.SystemConfig.simpleFind({ name });
        return this.coll2json(raws);
      }
      const data = await db.SystemConfig.simpleFindOne({ name });
      return data ? data.value : null;
    }
    // 修改系统配置
    async set(name, value) {
      await db.SystemConfig.update({ value }, { where: { name } });
    }
  }
  return MyService;
};
