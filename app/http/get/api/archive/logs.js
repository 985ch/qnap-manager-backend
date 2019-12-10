/**
 *获取所有归档历史记录（近50条）
*/
'use strict';

module.exports = () => {
  return {
    async controller() {
      const rules = await this.service.archive.rule.listLogs();
      this.success(rules);
    },
  };
};
