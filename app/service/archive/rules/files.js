// 仅移动文件：仅把目录下的文件移动到指定路径

'use strict';

const path = require('path');

module.exports = app => {
  class MyService extends app.Service {
    // 列出目录下的所有文件
    async run(from, file, to) {
      const newSource = path.join(from, file);
      const files = await this.service.qnap.filemanager.listFilename(newSource);
      for (const subFile of files) {
        await this.service.qnap.filemanager.moveFile(subFile, newSource, to);
      }
    }
  }
  return MyService;
};
