/**
 *编辑归档规则
*/
'use strict';

module.exports = () => {
  return {
    params: {
      pathBefore: 'string', // 编辑之前的路径
      regularBefore: 'string', // 编辑之前的正则表达式
      path: 'string',
      regular: 'string',
      rule: { type: 'string', default: 'default' },
      target: 'string',
      orderID: { type: 'integer', default: 0 },
    },
    userdata: { permission: 'admin' },
    async controller() {
      const { params } = this.state;
      const result = await this.service.archive.rule.editRule(params);
      this.success(result);
    },
  };
};
