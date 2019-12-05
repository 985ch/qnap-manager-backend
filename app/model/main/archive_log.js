'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
  // -------- begin sequelize-mg replace --------
  const model = app.mainDB.define('archive_log', {
    id: { type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true }, // 自增ID
    file: { type: DataTypes.STRING(200), allowNull: false }, // 文件名
    source: { type: DataTypes.STRING(200), allowNull: false }, // 源路径
    dest: { type: DataTypes.STRING(200), allowNull: false }, // 目标路径
    rule: { type: DataTypes.STRING(50), allowNull: false }, // 套用规则
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: app.mainDB.fn('current_timestamp') }, // 操作时间
  }, {
    tableName: 'archive_log',
  });
  // -------- end sequelize-mg replace --------

  utils.extendModel(model);
  model.associate = function() {
  };

  return model;
};
