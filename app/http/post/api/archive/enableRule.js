/**
 *启用归档规则
*/
'use strict';

module.exports = () => {
  return {
    params: {
      path: 'string',
      regular: 'string',
      enable: { type: 'integer', default: 0 },
    },
    userdata: { permission: 'admin' },
    async controller() {
      const { path, regular, enable } = this.state.params;
      const result = this.service.archive.rule.enableRule(path, regular, enable);
      this.success(result);
    },
  };
};
