const BaseModel = require('../base');
const User = require('../user');
const Permission = require('../permission');
module.exports = class Role extends BaseModel {
  static tableName = 'Role';
  static modelName = 'Role';
  static schema = require('./schema');
  static include = [
    {
      model: Permission,
      as: 'permission',
    },
    {
      model: User,
      as: 'user',
    },
  ];
  static associate(models) {
    this.hasMany(models.User, {
      foreignKey: 'RoleId',
    });
    this.hasMany(models.Permission);
  }
};
