const BaseModel = require('../base');
const User = require('../user');
const Course = require('../course');

module.exports = class enrolledCourse extends BaseModel {
  static modelName = 'enrolledCourse';
  static tableName = 'enrolledCourse';
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.User);
    this.belongsTo(models.Course);
  }
};
