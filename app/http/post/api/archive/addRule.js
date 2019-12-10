/**
 *添加归档规则
*/
'use strict';

module.exports = () => {
  return {
    params: {
      path: 'string',
      regular: 'string',
      rule: { type: 'string', default: 'default' },
      target: 'string',
      orderID: { type: 'integer', enum: [ 0, 1 ] },
    },
    userdata: { permission: 'admin' },
    async controller() {
      const { params } = this.state;
      const result = await this.service.archive.rule.addRule(params);
      this.success(result);
    },
  };
};
