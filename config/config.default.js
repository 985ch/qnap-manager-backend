/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');
const { env } = require('egg-sachikawa').Utils;

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1574410684769_6729';

  // 加密设置
  config.security = {
    csrf: {
      headerName: 'x-csrf-token', // 自定义请求头
    },
  };

  // 日志设置
  config.logger = {
    level: 'INFO',
    dir: path.join(appInfo.baseDir, `logs/${process.env.EGG_SERVER_ENV}`),
  };

  config.view = {
    defaultViewEngine: 'ejs',
    mapping: {
      '.html': 'ejs',
      '.ejs': 'ejs',
    },
  };

  // add your middleware config here
  config.middleware = [];

  // 数据库配置
  config.sequelize = require('./default/sequelize');

  // redis配置
  config.redis = require('./default/redis');

  // 缓存配置
  config.cache9 = require('./default/cache9');

  // add your user config here
  const userConfig = {
    qnap: {
      user: env('QNAP_FILEMANAGER_USERNAME'),
      pwd: env('QNAP_FILEMANAGER_PASSWORD'),
      host: env('QNAP_API_URL'),
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
