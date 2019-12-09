/**
 *获取系统配置
*/
'use strict';

module.exports = () => {
  return {
    userdata: { permission: 'admin' },
    async controller() {
      const configs = await this.service.system.config.listAll(true);
      this.success(configs);
    },
  };
};
