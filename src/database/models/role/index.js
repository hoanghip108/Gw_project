const BaseModel = require('../base');
const User = require('../user');
const RolePermission = require('../rolePermission');
module.exports = class Role extends BaseModel {
  static tableName = 'role';
  static modelName = 'role';
  static schema = require('./schema');
  static include = [
    {
      model: RolePermission,
      as: 'rolePermission',
    },
    {
      model: User,
      as: 'user',
    },
  ];
  static associate(models) {
    this.hasMany(models.User);
    this.hasMany(models.RolePermission);
  }
};
