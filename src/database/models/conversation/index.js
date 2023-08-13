const User = require('../user');
const BaseModel = require('../base');
const DeletedConversation = require('../deletedConversation');
const Participant = require('../participant');
module.exports = class Conversation extends BaseModel {
  static tableName = 'conversation';
  static modelName = 'conversation';
  static schema = require('./schema');
  static include = [
    {
      model: User,
      as: 'user',
    },
    {
      model: DeletedConversation,
      as: 'dConversation',
    },
    {
      model: Participant,
      as: 'participant',
    },
  ];
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'creatorId' });
    this.hasMany(models.DeletedConversation, { foreignKey: 'conversationId' });
    this.hasMany(models.Participant, { foreignKey: 'conversationId' });
  }
};
