const BaseModel = require('../base');
const User = require('../user');
const Course = require('../course');

module.exports = class enrolledCourse extends BaseModel {
  static modelName = 'EnrolledCourse';
  static tableName = 'EnrolledCourse';
  static schema = require('./schema');
  static include = [
    {
      model: User,
      as: 'user',
    },
    {
      model: Course,
      as: 'course',
    },
  ];
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.belongsTo(models.Course, { foreignKey: 'courseId' });
  }
};
