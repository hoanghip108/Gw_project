const BaseModel = require('../base');
const Conversation = require('../conversation/index');
const User = require('../user/index');
const DMessage = require('../deletedMessage/index');
module.exports = class Message extends BaseModel {
  static tableName = 'message';
  static modelName = 'message';
  static schema = require('./schema');
  static include = [
    {
      model: Conversation,
      as: 'conversation',
    },
    {
      model: User,
      as: 'user',
    },
    { model: DMessage, as: 'dMessage' },
  ];
  static associate(models) {
    this.belongsTo(models.Conversation, { foreignKey: 'conversationId' });
    this.belongsTo(models.User, { foreignKey: 'senderId' });
    this.belongsTo(models.User, { foreignKey: 'receiverId' });
    //this.hasMany(models.DMessage, { foreignKey: 'messageId' });
  }
};
