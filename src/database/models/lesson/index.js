const BaseModel = require('../base');
const Course = require('../course');
const LessonVideo = require('../lessonVideo');
module.exports = class Lesson extends BaseModel {
  static tableName = 'Lesson';
  static modelName = 'Lesson';
  static schema = require('./schema');
  static include = [
    {
      model: Course,
      as: 'course',
    },
    {
      model: LessonVideo,
      as: 'lessonVideo',
    },
  ];
  static associate(models) {
    this.belongsTo(models.Course, { foreignKey: 'courseId' });
    this.hasOne(models.LessonVideo, { foreignKey: 'lessonId' });
  }
};
