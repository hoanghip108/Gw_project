const BaseModel = require('../base');
const User = require('../user');

module.exports = class Post extends BaseModel {
  static tableName = 'Post';
  static modelName = 'Post';
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.User);
  }
};
