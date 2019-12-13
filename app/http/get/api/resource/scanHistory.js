/**
 * 获取扫描历史
*/
'use strict';

module.exports = () => {
  return {
    async controller() {
      const list = await this.service.resource.data.getScanLogs();
      this.success(list);
    },
  };
};
