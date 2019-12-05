/**
 *禁用归档规则
*/
'use strict';

module.exports = () => {
  return {
    params: {
      path: 'string',
      regular: 'string',
    },
    userdata: { permission: 'admin' },
    async controller() {
      const { path, regular } = this.state;
      const result = this.service.archive.rule.disableRule(path, regular);
      this.success(result);
    },
  };
};
