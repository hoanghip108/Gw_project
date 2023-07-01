const BaseModel = require('../base');
const Role = require('../role');
const User = require('../user');
module.exports = class userRole extends BaseModel {
  static tableName = 'userRole';
  static modelName = 'userRole';
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.Role);
    this.belongsTo(models.User);
  }
};
