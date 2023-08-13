const BaseModel = require('../base');
const BankAccount = require('../bankAccount/index');
const Role = require('../role');
const EnrolledCourse = require('../enrolledCourse/index');
const Post = require('../post/index');
const Conversation = require('../conversation/index');
const DMessage = require('../deletedMessage/index');
const DeletedConversation = require('../deletedConversation');
const Participant = require('../participant');
module.exports = class User extends BaseModel {
  static tableName = 'user';
  static modelName = 'user';
  static schema = require('./schema');
  static include = [
    { model: Role, as: 'role' },
    { model: EnrolledCourse, as: 'enrolledCourse' },
    { model: Post, as: 'post' },
    { model: Conversation, as: 'conversation' },
    { model: DMessage, as: 'dMessage' },
    { model: DeletedConversation, as: 'dConversation' },
  ];
  static associate(models) {
    this.belongsTo(models.Role, {
      foreignKey: 'RoleId',
    });
    this.hasMany(models.BankAccount);
    this.hasMany(models.EnrolledCourse, { foreignKey: 'courseId' });
    this.hasMany(models.Post);
    this.hasMany(models.Conversation, { foreignKey: 'conversationId' });
    this.hasMany(models.Message, { foreignKey: 'userId' });
    this.hasMany(models.DeletedConversation, { foreignKey: 'userId' });
    this.hasOne(models.Participant, { foreignKey: 'userId' });
  }
};
