const BaseModel = require('../base');
const BankAccount = require('../bankAccount/index');
const Role = require('../role');
const EnrolledCourse = require('../enrolledCourse/index');
const Post = require('../post/index');
module.exports = class User extends BaseModel {
  static tableName = 'user';
  static modelName = 'user';
  static schema = require('./schema');
  static include = [{ model: Role, as: 'role' }];
  static associate(models) {
    this.belongsTo(models.Role, {
      foreignKey: 'RoleId',
    });
    this.hasMany(models.BankAccount);
    this.hasMany(models.EnrolledCourse);
    this.hasMany(models.Post);
  }
};
