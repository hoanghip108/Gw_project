const BaseModel = require('../base');
const RolePermission = require('../rolePermission');
module.exports = class Permission extends BaseModel {
  static modelName = 'Permission';
  static tableName = 'Permission';
  static schema = require('./schema');
  static associate(models) {
    this.hasMany(models.RolePermission);
  }
};
