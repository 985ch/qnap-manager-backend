'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
  // -------- begin sequelize-mg replace --------
  const model = app.mainDB.define('archive_rule', {
    regular: { type: DataTypes.STRING(200), allowNull: false, primaryKey: true }, // 正则表达式
    path: { type: DataTypes.STRING(200), allowNull: false, primaryKey: true }, // 源路径
    rule: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'default' }, // 规则脚本
    target: { type: DataTypes.TEXT, allowNull: false }, // 归档路径
    enable: { type: DataTypes.INTEGER(4), allowNull: false, defaultValue: '1' }, // 启用状态
    orderID: { type: DataTypes.INTEGER(11), allowNull: false }, // 规则排序
  }, {
    tableName: 'archive_rule',
  });
  // -------- end sequelize-mg replace --------

  utils.extendModel(model);
  model.associate = function() {
  };

  return model;
};
