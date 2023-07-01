const BaseModel = require('../base');
const BankAccount = require('../bankAccount/index');
const UserRole = require('../userRole/index');
const EnrolledCourse = require('../enrolledCourse/index');
const Post = require('../post/index');
module.exports = class User extends BaseModel {
  static tableName = 'user';
  static modelName = 'user';
  static schema = require('./schema');
  static include = [];
  static associate(models) {
    this.hasMany(models.BankAccount);
    this.hasMany(models.UserRole);
    this.hasMany(models.EnrolledCourse);
    this.hasMany(models.Post);
  }
};
