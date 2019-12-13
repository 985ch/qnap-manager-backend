// 资源目录管理
'use strict';

module.exports = app => {
  const db = app.mainDB;
  class MyService extends app.Service {
    // 获取资源列表
    async list(where) {
      return await db.Resources.simpleFind(where);
    }
    // 获取扫描历史
    async getScanLogs() {
      return await db.ResourcesLog.findAll({
        limit: 100,
        order: [[ 'id', 'DESC' ]],
      });
    }
    // 添加资源数据
    async addResources(config, resPath, pathInfo, state) {
      for (const folder in pathInfo) {
        const cur = pathInfo[folder];
        if (cur.matched) continue;
        state.add++;
        const success = await this.updateResource(config, resPath, folder, cur.hash, cur.tree);
        state.add_failed = success ? 0 : 1;
      }
    }
    // 修改资源数据
    async modifyResource(config, res, pathInfo, state) {
      if (!pathInfo || res.hash === '') return;
      const cur = pathInfo[res.folder];
      if (!cur) {
        state.del++;
        const success = await this.updateResource(config, res.path, res.folder, '', '');
        state.del_failed += success ? 0 : 1;
      } else {
        if (cur.hash !== res.hash) {
          state.modify++;
          const success = await this.updateResource(config, res.path, res.folder, cur.hash, cur.tree);
          state.modify_failed += success ? 0 : 1;
        } else {
          state.keep++;
        }
        cur.matched = true; // 将对应文件标记为已匹配
      }
    }
    // 提交资源修改情况
    async updateResource(config, resPath, folder, hash, tree) {
      const success = await this.service.rpc.resource.updateResource(config, resPath, folder, tree);
      if (success) {
        this.logger.info(`update resource success [${resPath}/${folder}]`);
        await db.Resources.upsert({ path: resPath, folder, hash });
      } else {
        this.logger.info(`update resource failed [${resPath}/${folder}]`);
      }
      return success;
    }
    // 生成扫描日志
    async log(state) {
      db.ResourcesLog.create(state);
    }
    // 返回一个新的状态对象
    newState(path) {
      return {
        path,
        keep: 0,
        add: 0,
        add_failed: 0,
        del: 0,
        del_failed: 0,
        modify: 0,
        modify_failed: 0,
      };
    }
  }
  return MyService;
};
