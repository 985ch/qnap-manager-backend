'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
  // -------- begin sequelize-mg replace --------
  const model = app.mainDB.define('resources', {
    path: { type: DataTypes.STRING(300), allowNull: false, primaryKey: true }, // 路径
    title: { type: DataTypes.INTEGER(11), allowNull: false }, // 关联作品ID
    content: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' }, // 目录内容（压缩后的base64）
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
