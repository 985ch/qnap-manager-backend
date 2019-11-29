/**
 *修改系统配置
*/
'use strict';

module.exports = () => {
  return {
    params: {
      name: 'string',
      value: 'object',
    },
    userdata: { permission: 'admin' },
    async controller() {
      const { name, value } = this.state;
      await this.service.system.config.set(name, JSON.stringify(value));
      this.success('修改成功');
    },
  };
};
