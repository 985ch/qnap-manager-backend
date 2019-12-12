// 对接资源管理服务器
'use strict';
const { gzip } = require('base64zip');

module.exports = app => {
  class MyService extends app.Service {
    // 提交资源更新信息到资源管理服务器
    async updateResource({ host, key }, path, folder, tree) {
      const info = await gzip(tree, { base64: true });
      try {
        const res = await this.curl(host + '/rpc/updateResource', {
          method: 'POST',
          dataType: 'json',
          contentType: 'json',
          data: {
            key,
            path,
            folder,
            info,
          },
        });
        if (res.status !== 200) {
          throw new Error(`资源管理服务器访问失败(${res.status})`);
        }
        if (res.data.code !== 0) {
          throw new Error(`资源管理服务器返回错误(${res.data.code})[updateResource]`);
        }
        return true;
      } catch (e) {
        this.logger.error(e);
        return false;
      }
    }
  }
  return MyService;
};
