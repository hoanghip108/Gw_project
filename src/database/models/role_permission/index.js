const BaseModel = require('../base');
const Role = require('../role');
const Permission = require('../permission');
module.exports = class RolePermission extends BaseModel {
  static tableName = 'role_permission';
  static modelName = 'role_permission';
  static schema = require('./schema');
  static include = [
    {
      model: Role,
      as: 'role',
    },
    {
      model: Permission,
      as: 'permission',
    },
  ];
  static associate(models) {
    this.belongsTo(models.Role, {
      foreignKey: 'roleId',
      primaryKey: true,
    });
    this.belongsTo(models.Permission, {
      foreignKey: 'permissionId',
      primaryKey: true,
    });
  }
};
