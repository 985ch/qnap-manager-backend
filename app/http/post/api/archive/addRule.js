/**
 *添加归档规则
*/
'use strict';

module.exports = () => {
  return {
    params: {
      path: 'string',
      regular: 'string',
      rule: { type: 'string', value: 'default' },
      target: 'string',
      orderID: { type: 'integer', value: 0 },
    },
    userdata: { permission: 'admin' },
    async controller() {
      const params = this.state;
      const result = this.service.archive.rule.setRule(params);
      this.success(result);
    },
  };
};
