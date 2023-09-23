const BaseModel = require('../base');
const Role = require('../role');
const User = require('../user');
module.exports = class RolePermission extends BaseModel {
  static tableName = 'user_role';
  static modelName = 'user_role';
  static schema = require('./schema');
  static include = [
    {
      model: Role,
      as: 'role',
    },
    {
      model: User,
      as: 'user',
    },
  ];
  static associate(models) {}
};
