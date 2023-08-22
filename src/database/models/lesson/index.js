const BaseModel = require('../base');
const Course = require('../course');
const Section = require('../section');
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
    this.belongsTo(models.Section, { foreignKey: 'sectionId' });
  }
};
