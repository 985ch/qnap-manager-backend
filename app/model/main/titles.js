'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
  // -------- begin sequelize-mg replace --------
  const model = app.mainDB.define('titles', {
    id: { type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true }, // 作品ID
    title: { type: DataTypes.TEXT, allowNull: false }, // 作品标题，用逗号隔开多个别名
    type: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: '0' }, // 作品类型 0 电影 1 动画
    subtype: { type: DataTypes.STRING(32), allowNull: true }, // 子类型
    related: { type: DataTypes.TEXT, allowNull: true }, // 关联作品ID，以逗号隔开
    safe: { type: DataTypes.INTEGER(4), allowNull: false, defaultValue: '0' }, // 审查级别
    url: { type: DataTypes.TEXT, allowNull: false }, // 作品介绍地址
    updatetime: { type: DataTypes.DATE, allowNull: false, defaultValue: app.mainDB.fn('current_timestamp') }, // 更新时间
  }, {
    tableName: 'titles',
  });
  // -------- end sequelize-mg replace --------

  utils.extendModel(model);
  model.associate = function() {
  };

  return model;
};
