// 仅移动文件：仅把目录下的文件移动到指定路径

'use strict';

module.exports = app => {
  class MyService extends app.Service {
    // 列出目录下的所有文件
    async run(from, file, to) {
      const newSource = `${from}/${file}`;
      const files = await this.service.qnap.filemanager.listFilename(newSource);
      if (files.length === 0) return false;
      for (const subFile of files) {
        await this.service.qnap.filemanager.move(subFile, newSource, to);
      }
      return true;
    }
  }
  return MyService;
};
