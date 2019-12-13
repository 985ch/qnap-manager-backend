/**
 * 获取资源列表
*/
'use strict';

module.exports = () => {
  return {
    async controller() {
      const list = await this.service.resource.data.list();
      this.success(list);
    },
  };
};
