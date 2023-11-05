const BaseModel = require('../base');
const User = require('../user');
module.exports = class FriendShip extends BaseModel {
  static tableName = 'friendShip';
  static modelName = 'friendShip';
  static include = [
    {
      model: User,
      as: 'user',
    },
  ];
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'senderId' });
    this.belongsTo(models.User, { foreignKey: 'receiverId' });
  }
};
