// 资源目录管理

'use strict';
const crypto = require('crypto');

module.exports = app => {
  const db = app.mainDB;
  class MyService extends app.Service {
    // 检查并更新所有资源目录
    async checkAll() {
      const { archive_server, resource_path } = await this.service.system.config.get([ 'archive_server', 'resource_path' ]);
      const resources = await db.Resources.simpleFind();
      const state = this.newState('*');

      if (!archive_server.host || archive_server.host === '') return this.logger.info('invaild host');

      // 获取监控路径下的所有资源，并计算其哈希值
      const paths = {};
      for (const resPath of resource_path) {
        paths[resPath] = await this.readResourcePath(resPath);
      }

      // 找出减少的和变更的部分并提交
      for (const res of resources) {
        await this.modifyResource(archive_server, res, paths[res.path], state);
      }

      // 提交所有新增文件
      for (const resPath in paths) {
        await this.addResources(archive_server, resPath, paths[resPath], state);
      }

      db.ResourcesLog.create(state);
    }
    // 检查并更新指定的资源目录
    async checkResourcePath(resPath) {
      const config = await this.service.system.config.get('archive_server');
      const resources = await db.Resources.simpleFind({ path: resPath });
      const state = this.newState(resPath);

      // 获取资源并计算哈希值
      const pathInfo = await this.readResourcePath(resPath);

      // 找出减少的和变更的部分并提交
      for (const res of resources) {
        await this.modifyResource(config, res, pathInfo, state);
      }

      // 提交所有新增文件
      await this.addResources(config, resPath, pathInfo, state);

      db.ResourcesLog.create(state);
      return state;
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
      if (!pathInfo) return;
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
    // 获取资源列表
    async list() {
      return await db.Resources.simpleFind();
    }
    // 提交资源修改情况
    async updateResource(config, resPath, folder, hash, tree) {
      const success = await this.service.rpc.resource.updateResource(config, resPath, folder, tree);
      if (success) {
        this.logger.info(`update resouce success [${resPath}/${folder}]`);
        await db.Resources.upsert({ path: resPath, folder, hash });
      } else {
        this.logger.info(`update resouce failed [${resPath}/${folder}]`);
      }
      return success;
    }
    // 读取指定的资源路径，并将结果填入paths
    async readResourcePath(resPath, pageLimit = 1000) {
      let page = -1;
      let total = 0;
      const curPath = {};
      do {
        page++;
        const files = await this.service.qnap.filemanager.listFiles(resPath, pageLimit, page);
        total = files.total;

        // 读取每个目录，并生成目录信息（忽略普通文件）
        for (const file of files.datas) {
          if (file.isfolder) {
            const treeData = await this.readFolder(`${resPath}/${file.filename}`);
            const tree = JSON.stringify(treeData);
            curPath[file.filename] = {
              hash: crypto.createHash('md5').update(tree).digest('hex'),
              tree,
            };
          }
        }
      } while (total > page * pageLimit + pageLimit);

      return curPath;
    }
    // 检查指定路径下的文件并计算哈希值
    async readFolder(root, pageLimit = 1000) {
      let page = -1;
      let total = 0;
      const result = {};
      do {
        page++;
        const files = await this.service.qnap.filemanager.listFiles(root, pageLimit, page);
        total = files.total;
        for (const file of files.datas) {
          if (file.isfolder) {
            const children = await this.readFolder(`${root}/${file.filename}`, pageLimit);
            result[file.filename] = { files: children };
          } else {
            result[file.filename] = {
              size: file.filesize,
              mt: file.mt,
            };
          }
        }
      } while (total > page * pageLimit + pageLimit);

      return result;
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
