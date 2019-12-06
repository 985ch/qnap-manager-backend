/**
 *修改归档的扫描路径
*/
'use strict';

module.exports = () => {
  return {
    params: {
      paths: 'string',
    },
    userdata: { permission: 'admin' },
    async controller() {
      const { paths } = this.state;
      await this.service.system.config.set('archive_path', JSON.stringify(paths));
      this.success('修改成功');
    },
  };
};
