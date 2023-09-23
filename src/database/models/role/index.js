const BaseModel = require('../base');
const User = require('../user');
const User_role = require('../user_role');
const Permission = require('../permission');
const Role_permission = require('../role_permission');
module.exports = class Role extends BaseModel {
  static tableName = 'role';
  static modelName = 'role';
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
    this.belongsToMany(models.User, {
      through: 'user_role',
      foreignKey: 'roleId',
      primaryKey: true,
    });
    this.belongsToMany(models.Permission, {
      through: 'role_permission',
      foreignKey: 'roleId',
      primaryKey: true,
    });
  }
};
