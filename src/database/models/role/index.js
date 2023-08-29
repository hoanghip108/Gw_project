const BaseModel = require('../base');
const User = require('../user');
const Permission = require('../permission');
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
    this.hasMany(models.User, {
      foreignKey: 'RoleId',
    });
    this.hasMany(models.Permission, { foreignKey: 'roleId' });
  }
};
