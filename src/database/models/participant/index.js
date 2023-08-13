const BaseModel = require('../base');
const User = require('../user');
const Conversation = require('../conversation');

module.exports = class Participant extends BaseModel {
  static tableName = 'participant';
  static modelName = 'participant';
  static schema = require('./schema');
  static include = [
    {
      model: User,
      as: 'user',
    },
    { model: Conversation, as: 'conversation' },
  ];
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.belongsTo(models.Conversation, { foreignKey: 'conversationId' });
  }
};
