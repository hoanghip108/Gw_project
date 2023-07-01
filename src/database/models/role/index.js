const BaseModel = require('../base');
const UserRole = require('../userRole');
const RolePermission = require('../rolePermission');
module.exports = class Role extends BaseModel {
  static tableName = 'role';
  static modelName = 'role';
  static schema = require('./schema');
  static associate(models) {
    this.hasMany(models.UserRole);
    this.hasMany(models.RolePermission);
  }
};
