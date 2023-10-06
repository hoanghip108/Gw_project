const BaseModel = require('../base');
const BankAccount = require('../bankAccount/index');
const Role = require('../role');
const EnrolledCourse = require('../enrolledCourse/index');
const Post = require('../post/index');
const Conversation = require('../conversation/index');
const DMessage = require('../deletedMessage/index');
const DeletedConversation = require('../deletedConversation');
const Participant = require('../participant');
const TransactionHistory = require('../transactionHistory');
const Cart = require('../cart');
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
    { model: TransactionHistory, as: 'transactionHistory' },
    { model: Cart, as: 'cart' },
  ];
  static associate(models) {
    this.belongsToMany(models.Role, {
      through: 'user_role',
      foreignKey: 'userId',
      primaryKey: true,
    });
    this.hasMany(models.BankAccount);
    this.hasMany(models.EnrolledCourse, { foreignKey: 'courseId' });
    this.hasMany(models.Post);
    this.hasMany(models.Conversation, { foreignKey: 'creatorId' });
    this.hasMany(models.Message, { foreignKey: 'senderId' });
    this.hasMany(models.Message, { foreignKey: 'receiverId' });
    this.hasMany(models.DeletedConversation, { foreignKey: 'userId' });
    this.hasMany(models.Participant, { foreignKey: 'userId' });
    this.hasMany(models.TransactionHistory, { foreignKey: 'userId' });
    this.hasOne(models.Cart, { foreignKey: 'userId' });
  }
};
