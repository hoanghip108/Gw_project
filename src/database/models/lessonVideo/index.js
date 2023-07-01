const BaseModel = require('../base');
const Lesson = require('../lesson');

module.exports = class LessonVideo extends BaseModel {
  static tableName = 'LessonVideo';
  static modelName = 'LessonVideo';
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.Lesson);
  }
};
