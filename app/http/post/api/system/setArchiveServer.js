/**
 *修改归档服务器信息
*/
'use strict';

module.exports = () => {
  return {
    params: {
      host: 'string',
      key: 'string',
    },
    userdata: { permission: 'admin' },
    async controller() {
      await this.service.system.config.set('archive_server', JSON.stringify(this.state.params));
      this.success('修改成功');
    },
  };
};
