const BaseModel = require('../base');
const Course = require('../course');
const Lesson = require('../lesson');
module.exports = class Section extends BaseModel {
  static tableName = 'Section';
  static modelName = 'Section';
  static include = [
    {
      model: Course,
      as: 'course',
    },
    {
      model: Lesson,
      as: 'lesson',
    },
  ];
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.Course, { foreignKey: 'courseId' });
    this.hasMany(models.Lesson, { foreignKey: 'sectionId' });
  }
};
