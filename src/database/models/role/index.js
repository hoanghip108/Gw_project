const BaseModel = require('../base');
const User = require('../user');
const User_role = require('../user_role');
const Role_permission = require('../role_permission');
const UserRolePending = require('../userRolePending');
module.exports = class Role extends BaseModel {
  static tableName = 'role';
  static modelName = 'role';
  static schema = require('./schema');
  static include = [
    {
      model: UserRolePending,
      as: 'userRolePending',
    },
    {
      model: Role_permission,
      as: 'role_permission',
    },
    {
      model: User_role,
      as: 'user_role',
    },
  ];
  static associate(models) {
    this.hasMany(models.User_role, {
      foreignKey: 'roleId',
    });
    this.hasMany(models.Role_permission, { foreignKey: 'roleId' });
    this.hasMany(models.UserRolePending, { foreignKey: 'roleId' });
  }
};
