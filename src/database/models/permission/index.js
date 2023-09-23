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
  ];
  static associate(models) {
    this.belongsToMany(models.Role, {
      through: 'role_permission',
      foreignKey: 'permissionId',
      primaryKey: true,
    });
  }
};
