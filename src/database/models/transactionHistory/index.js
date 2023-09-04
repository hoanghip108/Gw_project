const BaseModel = require('../base');
const User = require('../user');

module.exports = class TransactionHistory extends BaseModel {
  static tableName = 'transactionHistory';
  static modelName = 'transactionHistory';
  static schema = require('./schema');
  static include = [
    {
      model: User,
      as: 'user',
    },
  ];
  // static associate(models) {
  //   this.belongsTo(models.user, {
  //     foreignKey: 'userId',
  //   });
  // }
};
