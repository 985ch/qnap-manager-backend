// 归档规则管理

'use strict';

module.exports = app => {
  const db = app.mainDB;
  class MyService extends app.Service {
    // 获取所有规则
    async listAll(enableOnly) {
      const findJson = {
        order: [[ 'orderID', 'ASC' ]],
        raw: true,
      };
      if (enableOnly)findJson.where = { enable: 1 };
      return await db.ArchiveLog.findAll(findJson);
    }
    // 添加/修改规则
    async setRule({ path, regular, rule, target, orderID }) {
      return await db.ArchiveLog.findOrCreate({
        where: { path, regular },
        defaults: {
          path,
          regular,
          rule,
          target,
          enable: 1,
          orderID,
        },
      });
    }
    // 禁用规则
    async disableRule(path, regular) {
      return await db.ArchiveLog.update({ enable: 0 }, { where: { path, regular } });
    }
    // 对所有目录执行归档
    async runAllArchives() {
      const archivePaths = await this.service.system.config.get('archive_path');
      for (const path of archivePaths) {
        const list = await this.runArchive(path);
        for (const info of list) {
          if (info.dest === null) this.logger.info(`ignore file:${info.file}[${info.source}]`);
        }
      }
    }
    // 对目录执行归档
    async runArchive(path) {
      // 获取指定目录的规则和文件
      const filemanager = this.service.qnap.filemanager;
      const rules = await db.ArchiveRule.findAll({
        where: { path, enable: 1 },
        order: [[ 'orderID', 'ASC' ]],
        raw: true,
      });
      const files = await filemanager.listFilename(path);

      // 对列出来的文件逐个执行规则
      const results = [];
      for (const file of files) {
        let result = null;
        for (const rule of rules) {
          result = await this.runRule(file, rule);
          if (result) {
            db.ArchiveLog.create(result);
            results.push(result);
            break;
          }
        }
        if (!result) {
          results.push({
            file,
            source: path,
            dest: null,
            rule: null,
          });
        }
      }
      return results;
    }
    // 尝试对某个文件执行归档
    async runRule(file, { path, regular, rule, target }) {
      const checker = new RegExp(regular);
      if (!checker.test(file)) return null;
      const success = await this.service.archive.rules[rule].run(path, file, target);
      return success ? {
        file,
        source: path,
        dest: target,
        rule,
      } : null;
    }
  }
  return MyService;
};
