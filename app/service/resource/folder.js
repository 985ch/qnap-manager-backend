// 资源目录管理

'use strict';
const crypto = require('crypto');

module.exports = app => {
  class MyService extends app.Service {
    // 检查并更新所有资源目录
    async checkAll() {
      const data = this.service.resource.data;
      const { archive_server, resource_path } = await this.service.system.config.get([ 'archive_server', 'resource_path' ]);
      const resources = await data.list();
      const state = data.newState('*');

      if (!archive_server.host || archive_server.host === '') return this.logger.info('invaild host');

      // 获取监控路径下的所有资源，并计算其哈希值
      const paths = {};
      for (const resPath of resource_path) {
        paths[resPath] = await this.readResourcePath(resPath);
      }

      // 找出减少的和变更的部分并提交
      for (const res of resources) {
        await data.modifyResource(archive_server, res, paths[res.path], state);
      }

      // 提交所有新增文件
      for (const resPath in paths) {
        await data.addResources(archive_server, resPath, paths[resPath], state);
      }

      data.log(state);
    }
    // 检查并更新指定的资源目录
    async checkResourcePath(resPath) {
      const data = this.service.resource.data;
      const config = await this.service.system.config.get('archive_server');
      const resources = await data.list({ path: resPath });
      const state = data.newState(resPath);

      // 获取资源并计算哈希值
      const pathInfo = await this.readResourcePath(resPath);

      // 找出减少的和变更的部分并提交
      for (const res of resources) {
        await data.modifyResource(config, res, pathInfo, state);
      }

      // 提交所有新增文件
      await data.addResources(config, resPath, pathInfo, state);

      data.log(state);
      return state;
    }
    // 读取指定的资源路径，并将结果填入paths
    async readResourcePath(resPath) {
      const curPath = {};
      const filemanager = this.service.qnap.filemanager;
      const files = await filemanager.listAllFiles(resPath);

      // 读取每个目录，并生成目录信息（忽略普通文件）
      for (const file of files) {
        if (file.isfolder) {
          const treeData = await filemanager.getTree(`${resPath}/${file.filename}`);
          const tree = JSON.stringify(treeData);
          curPath[file.filename] = {
            hash: crypto.createHash('md5').update(tree).digest('hex'),
            tree,
          };
        }
      }

      return curPath;
    }
  }
  return MyService;
};
