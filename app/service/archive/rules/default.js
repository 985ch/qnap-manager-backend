// 默认操作：将文件或文件夹本身移动到指定路径

'use strict';

module.exports = app => {
  class MyService extends app.Service {
    // 列出目录下的所有文件
    async run(from, file, to) {
      await this.service.qnap.filemanager.move(file, from, to);
      return true;
    }
  }
  return MyService;
};
