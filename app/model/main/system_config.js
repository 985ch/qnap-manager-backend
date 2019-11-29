'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
  // -------- begin sequelize-mg replace --------
  const model = app.mainDB.define('system_config', {
    name: { type: DataTypes.STRING(16), allowNull: false, primaryKey: true }, // 配置名
    value: { type: DataTypes.TEXT, allowNull: false }, // 配置内容，JSON压缩成base64
    commet: { type: DataTypes.TEXT, allowNull: false }, // 注释
  }, {
    tableName: 'system_config',
  });
  // -------- end sequelize-mg replace --------

  utils.extendModel(model, [ 'name', 'value' ], [
    {
      list: [ 'value' ],
      filter: raw => utils.pJson(raw, null),
    },
  ]);
  model.associate = function() {
  };

  return model;
};
