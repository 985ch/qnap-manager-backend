'use strict';

const utils = require('egg-sachikawa').Utils;

module.exports = app => {
  const DataTypes = app.Sequelize;
  // -------- begin sequelize-mg replace --------
  const model = app.mainDB.define('users', {
    id: { type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true }, // 用户ID
    name: { type: DataTypes.STRING(16), allowNull: false, defaultValue: '' }, // 用户名
    nick: { type: DataTypes.STRING(32), allowNull: true }, // 用户昵称
    permissions: { type: DataTypes.TEXT, allowNull: true }, // 用户权限
    password: { type: DataTypes.STRING(50), allowNull: false }, // 用户密码(加盐后的md5)
    salt: { type: DataTypes.STRING(50), allowNull: false }, // 用户密码加盐字符串
  }, {
    tableName: 'users',
  });
  // -------- end sequelize-mg replace --------

  utils.extendModel(model, [ 'id', 'name', 'nick', 'permissions' ], [
    {
      list: [ 'permissions' ],
      filter: raw => { return utils.pJson(raw, []) || []; },
    },
  ]);
  model.associate = function() {
  };

  return model;
};
