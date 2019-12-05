/**
 *获取所有归档规则
*/
'use strict';

module.exports = () => {
  return {
    userdata: { permission: 'admin' },
    async controller() {
      const rules = this.service.archive.rule.listAll();
      this.success(rules);
    },
  };
};
