const BaseModel = require('../base');
const Role_permission = require('../role_permission');

module.exports = class Permission extends BaseModel {
  static modelName = 'permission';
  static tableName = 'permission';
  static schema = require('./schema');
  static include = [
    {
      model: Role_permission,
      as: 'role_permission',
    },
  ];
  static associate(models) {
    this.belongsToMany(models.Role, {
      through: 'role_permission',
      foreignKey: 'permissionId',
    });
  }
};
