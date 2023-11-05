const BaseModel = require('../base');
const User = require('../user');
const Message = require('../message');

module.exports = class DeletedMessage extends BaseModel {
  static tableName = 'deletedMessage';
  static modelName = 'deletedMessage';
  static schema = require('./schema');
  static include = [
    { model: User, as: 'user' },
    { model: Message, as: 'message' },
  ];
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.belongsTo(models.Message, { foreignKey: 'messageId' });
  }
};
