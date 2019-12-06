'use strict';

const _ = require('lodash');
const { env } = require('egg-sachikawa').Utils;

const cfg = {
  username: env('NAS_MARIADB_ACCOUNT'),
  password: env('NAS_MARIADB_PASSWORD'),
  host: env('NAS_MARIADB_URL'),
  dialect: 'mysql',
  timezone: '+08:00',
  define: {
    underscored: false,
    underscoredAll: false,
    timestamps: false, // 禁止自动添加更新时间字段
    freezeTableName: true, // 冻结表名，防止自动给表名添加s变成复数形式
  },
};

module.exports = {
  datasources: [
    _.extend({}, cfg, {
      delegate: 'mainDB',
      baseDir: 'model/main',
      database: 'manager',
    }),
  ],
};
