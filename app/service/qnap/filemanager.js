// QNAP文件管理接口
'use strict';

const _ = require('lodash');

module.exports = app => {
  const qnapCfg = app.config.qnap;
  const baseUrl = qnapCfg.host + '/cgi-bin/filemanager';
  const redis = app.redis.get('main');
  class MyService extends app.Service {
    // 获取登陆凭证
    async getSid(force = false) {
      let sid = null;
      if (!force) {
        sid = await redis.get('qnap:sid');
        if (sid) return sid;
      }
      const data = {
        user: qnapCfg.user,
        pwd: qnapCfg.pwd,
      };
      let result = await this.ctx.curl(baseUrl + '/wfm2Login.cgi', { dataType: 'json', data });
      if (result.status !== 200) throw new Error(`request QNAP failed:${result.status}`);
      result = result.data;
      if (result.status !== 1) throw new Error(`QNAP login in failed:${result.status}`);
      sid = result.sid;
      await redis.setex('qnap:sid', 1800, sid);
      return sid;
    }
    // 执行对应API
    async runFunc(data, retry = false) {
      let result = await this.ctx.curl(baseUrl + '/utilRequest.cgi', {
        dataType: 'json',
        data,
        timeout: 300000,
      });
      if (result.status !== 200) throw new Error(`request QNAP failed:${result.status}`);
      result = result.data;
      if (result.status) {
        if (result.status === 1) {
          return result;
        } else if (result.status === 4 && !retry) {
          data.sid = this.getSid(true);
          return await this.runFunc(data, true);
        }
        throw new Error(`QNAP api failed:(${result.status})${data.func}`);
      }
      return result;
    }
    // 执行文件管理器API
    async run(func, params) {
      const sid = await this.getSid();
      const data = _.assign({ sid, func }, params);
      return await this.runFunc(data);
    }
    // 列出目录下的文件
    async listFiles(path, limit, page) {
      return await this.run('get_list', {
        is_iso: 0, // Is a iso share. 1: yes,0: no
        list_mode: 'all', // Value is “all”
        path, // Folder path
        dir: 'ASC', // Sorting direction. ASC: Ascending , DESC: Descending
        limit, // Number of response datas
        sort: 'filename', // Sort field (filename/filesize/filetype/mt/privilege/owner/group)
        start: page * limit, // Response data start index
        hidden_file: 0, // List hidden file or not. 0:donnot list hidden files, 1:list files
      });
    }
    // 列出目录下的所有文件
    async listAllFiles(path, limit = 100) {
      let page = -1;
      let total = 0;
      let datas = [];
      do {
        page++;
        const files = await this.listFiles(path, limit, page);
        datas = datas.concat(files.datas);
        total = files.total;
      } while (total > page * limit + limit);

      return datas;
    }
    // 列出目录下所有文件的文件名
    async listFilename(path) {
      const datas = await this.listAllFiles(path);
      const files = [];
      const count = datas.length;
      for (let i = 0; i < count; i++) {
        files.push(datas[i].filename);
      }
      return files;
    }
    // 获取目录下的树形结构
    async getTree(root) {
      const result = {};
      const files = await this.listAllFiles(root);
      for (const file of files) {
        if (file.isfolder) {
          const children = await this.getTree(`${root}/${file.filename}`);
          result[file.filename] = { files: children };
        } else {
          result[file.filename] = {
            size: file.filesize,
            mt: file.mt,
          };
        }
      }

      return result;
    }
    // 移动文件
    async move(file, from, to) {
      const { status } = await this.run('move', {
        source_file: file, // Name of the copied file/folder
        source_total: 1, // Total number of copied files/folders
        source_path: from, // Source path of the copied file/folder
        dest_path: to, // Destination of the copied file/folder
        mode: 0, // 1: skip, 0: overwrite
      });
      return status;
    }
  }
  return MyService;
};
