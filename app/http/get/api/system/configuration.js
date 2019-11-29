/**
 *获取系统配置
*/
'use strict';

module.exports = () => {
  return {
    userdata: { permission: 'admin' },
    async controller() {
      const configs = this.service.system.config.listAll();
      this.success(configs);
    },
  };
};
