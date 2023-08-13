'use strict';
const BaseModel = require('../base');
const Conversation = require('../conversation');
const User = require('../user');
module.exports = class DeletedConversation extends BaseModel {
  static tableName = 'deletedConversation';
  static modelName = 'deletedConversation';
  static schema = require('./schema');
  static include = [
    { model: Conversation, as: 'conversation' },
    { model: User, as: 'user' },
  ];
  static associate(models) {
    this.belongsTo(models.Conversation, { foreignKey: 'conversationId' });
    this.belongsTo(models.User, { foreignKey: 'userId' });
  }
};
