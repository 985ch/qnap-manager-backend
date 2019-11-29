'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
  // -------- begin sequelize-mg replace --------
  const model = app.mainDB.define('tags', {
    id: { type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true }, // 标签ID
    alias: { type: DataTypes.STRING(50), allowNull: true }, // 标签
    type: { type: DataTypes.INTEGER(11), allowNull: true }, // 标签类型
    safe: { type: DataTypes.INTEGER(4), allowNull: true }, // 审查级别
  }, {
    tableName: 'tags',
  });
  // -------- end sequelize-mg replace --------

  utils.extendModel(model);
  model.associate = function() {
  };

  return model;
};
