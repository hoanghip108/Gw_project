const BaseModel = require('../base');
const Role_permission = require('../role_permission');
const Role = require('../role');
module.exports = class Permission extends BaseModel {
  static modelName = 'permission';
  static tableName = 'permission';
  static schema = require('./schema');
  static include = [
    {
      model: Role,
      as: 'role',
    },
    {
      model: Role_permission,
      as: 'role_permission',
    },
  ];
  static associate(models) {
    this.hasMany(models.Role_permission, { foreignKey: 'permissionId' });
  }
};
