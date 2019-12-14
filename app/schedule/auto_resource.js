/**
* 定时执行资源扫描并提交到服务器
*/
'use strict';

module.exports = () => {
  return {
    schedule: {
      cron: '0 30 3 * * *',
      type: 'worker',
      disable: false,
    },
    async task(ctx) {
      ctx.logger.info('start resources update');
      await ctx.service.resource.folder.checkAll();
      ctx.logger.info('complete resources update');
    },
  };
};
