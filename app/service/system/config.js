// 系统配置管理

'use strict';

module.exports = app => {
  const db = app.mainDB;
  class MyService extends app.Service {
    // 获取所有系统配置
    async listAll() {
      const raws = await db.SystemConfig.simpleFind();
      const configs = {};
      for (const obj of raws) {
        configs[obj.name] = obj.value;
      }
      return configs;
    }
    // 获取特定的配置
    async get(name) {
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
