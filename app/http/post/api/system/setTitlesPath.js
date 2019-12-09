/**
 *修改作品的扫描路径
*/
'use strict';

module.exports = () => {
  return {
    params: {
      paths: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    userdata: { permission: 'admin' },
    async controller() {
      const { paths } = this.state.params;
      await this.service.system.config.set('titles_path', JSON.stringify(paths));
      this.success('修改成功');
    },
  };
};
