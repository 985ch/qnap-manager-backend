/**
 *修改作品的扫描路径
*/
'use strict';
const _ = require('lodash');

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
      await this.service.system.config.set('resource_path', JSON.stringify(_.uniq(paths)));
      this.success('修改成功');
    },
  };
};
