'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
  // -------- begin sequelize-mg replace --------
  const model = app.mainDB.define('auto_archiving', {
    regular: { type: DataTypes.STRING(100), allowNull: false, primaryKey: true }, // 正则表达式
    target: { type: DataTypes.TEXT, allowNull: false }, // 归档路径
    enable: { type: DataTypes.INTEGER(4), allowNull: false, defaultValue: '1' }, // 启用状态
    children: { type: DataTypes.INTEGER(4), allowNull: false, defaultValue: '0' }, // 是否检索子目录
  }, {
    tableName: 'auto_archiving',
  });
  // -------- end sequelize-mg replace --------

  utils.extendModel(model);
  model.associate = function() {
  };

  return model;
};
