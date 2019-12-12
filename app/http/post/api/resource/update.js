/**
 * 更新指定资源路径的资源
*/
'use strict';

module.exports = () => {
  return {
    params: {
      path: 'string',
    },
    async controller() {
      const result = await this.service.resouce.folder.checkResourcePath(this.state.params.path);
      this.success(result);
    },
  };
};
