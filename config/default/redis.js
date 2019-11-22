// redis配置
'use strict';

const { env } = require('egg-sachikawa').Utils;

module.exports = {
  default: {
    port: 6379,
    password: env('NAS_REDIS_PASSWORD'),
    host: env('NAS_REDIS_URL'),
  },
  app: true,
  agent: false,
  clients: {
    main: {
      db: 0,
    },
    cacheSub: {
      db: 0,
    },
    cachePub: {
      db: 0,
    },
  },
};
