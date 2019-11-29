/* eslint valid-jsdoc: "off" */

'use strict';

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
    csrf: false,
    ctoken: false,
    domainWhiteList: [ 'localhost:9528' ], // 允许跨域的白名单,为false时不限制跨域
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
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
