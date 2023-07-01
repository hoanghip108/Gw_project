const BaseModel = require('../base');
const EnrolledCourse = require('../enrolledCourse');
const Lesson = require('../lesson');
module.exports = class Course extends BaseModel {
  static tableName = 'Course';
  static modelName = 'Course';
  static schema = require('./schema');
  static associate(models) {
    this.hasMany(models.EnrolledCourse);
    this.hasMany(models.Lesson);
  }
};
