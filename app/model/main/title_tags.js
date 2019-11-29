'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
  // -------- begin sequelize-mg replace --------
  const model = app.mainDB.define('title_tags', {
    tag: { type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true }, // 标签ID
    title: { type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true }, // 作品ID
  }, {
    tableName: 'title_tags',
  });
  // -------- end sequelize-mg replace --------

  utils.extendModel(model);
  model.associate = function() {
  };

  return model;
};
