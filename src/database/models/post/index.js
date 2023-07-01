const BaseModel = require('../base');
const User = require('../user');

module.exports = class Post extends BaseModel {
  static tableName = 'post';
  static modelName = 'post';
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.User);
  }
};
