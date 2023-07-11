const BaseModel = require('../base');
const User = require('../user');
const Course = require('../course');

module.exports = class enrolledCourse extends BaseModel {
  static modelName = 'EnrolledCourse';
  static tableName = 'EnrolledCourse';
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.User);
    this.belongsTo(models.Course);
  }
};
