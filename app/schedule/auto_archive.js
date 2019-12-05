/**
* 定时执行归档
* @version 1.0.180427
*/
'use strict';

module.exports = () => {
  return {
    schedule: {
      cron: '0 0 * * * *',
      type: 'worker',
      disable: false,
    },
    async task(ctx) {
      ctx.logger.info('start archive');
      await ctx.service.archive.rule.runAllArchives();
      ctx.logger.info('complete archive');
    },
  };
}
;
