const BaseModel = require('../base');
const Course = require('../course');
module.exports = class Lesson extends BaseModel {
  static tableName = 'Lesson';
  static modelName = 'Lesson';
  static schema = require('./schema');
  static include = [
    {
      model: Course,
      as: 'course',
    },
  ];
  static associate(models) {
    this.belongsTo(models.Course, { foreignKey: 'courseId' });
  }
};
