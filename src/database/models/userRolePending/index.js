const BaseModel = require('../base');
const Role = require('../role');
const User = require('../user');

module.exports = class userRolePending extends BaseModel {
  static tableName = 'userRolePending';
  static modelName = 'userRolePending';
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
  static associate(models) {
    this.belongsTo(models.Role, {
      foreignKey: 'roleId',
    }),
      this.belongsTo(models.User, {
        foreignKey: 'userId',
      });
  }
};
