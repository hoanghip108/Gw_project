const BaseModel = require('../base');
const Course = require('../course');
const LessonVideo = require('../lessonVideo');
module.exports = class Lesson extends BaseModel {
  static tableName = 'Lesson';
  static modelName = 'Lesson';
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.Course);
    this.hasOne(models.LessonVideo);
  }
};
