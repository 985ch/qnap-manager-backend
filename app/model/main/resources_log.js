'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
  // -------- begin sequelize-mg replace --------
  const model = app.mainDB.define('resources_log', {
    id: { type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true }, // 自增ID
    path: { type: DataTypes.STRING(200), allowNull: false, defaultValue: '' }, // 资源路径，为空字符串时表示所有路径
    keep: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: '0' }, // 保持没变的资源
    add: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: '0' }, // 成功增加的资源
    add_failed: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: '0' }, // 增加失败的资源
    del: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: '0' }, // 减少的资源
    del_failed: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: '0' }, // 减少失败的资源
    modify: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: '0' }, // 修改的资源
    modify_failed: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: '0' }, // 修改失败的资源
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: app.mainDB.fn('current_timestamp') }, // 日志时间
  }, {
    tableName: 'resources_log',
  });
  // -------- end sequelize-mg replace --------

  utils.extendModel(model);
  model.associate = function() {
  };

  return model;
};
