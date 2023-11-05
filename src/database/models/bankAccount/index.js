const BaseModel = require('../base');
const User = require('../user/index');
module.exports = class bankAccount extends BaseModel {
  static tableName = 'BankAccount';
  static modelName = 'BankAccount';
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.User);
  }
};
