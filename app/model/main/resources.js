'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
  // -------- begin sequelize-mg replace --------
  const model = app.mainDB.define('resources', {
    path: { type: DataTypes.STRING(200), allowNull: false, primaryKey: true }, // 资源路径
    folder: { type: DataTypes.STRING(100), allowNull: false, primaryKey: true }, // 目录名
    hash: { type: DataTypes.STRING(50), allowNull: true, defaultValue: '' }, // 速查哈希值
    updatetime: { type: DataTypes.DATE, allowNull: false, defaultValue: app.mainDB.fn('current_timestamp') }, // 更新时间
  }, {
    tableName: 'resources',
  });
  // -------- end sequelize-mg replace --------

  utils.extendModel(model);
  model.associate = function() {
  };

  return model;
};
