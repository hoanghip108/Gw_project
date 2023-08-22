const BaseModel = require('../base');
const EnrolledCourse = require('../enrolledCourse');
const Lesson = require('../lesson');
const SubCategory = require('../subCategory');
const Section = require('../section');
module.exports = class Course extends BaseModel {
  static tableName = 'Course';
  static modelName = 'Course';
  static schema = require('./schema');
  static include = [
    {
      model: EnrolledCourse,
      as: 'enrolledCourse',
    },
    { model: Lesson, as: 'lesson' },
    { model: SubCategory, as: 'subCategory' },
  ];
  static associate(models) {
    this.belongsTo(models.SubCategory, { foreignKey: 'subCateId' });
    this.hasMany(models.EnrolledCourse, { foreignKey: 'courseId' });
    this.hasMany(models.Lesson, { foreignKey: 'courseId' });
    this.hasMany(models.Section, { foreignKey: 'courseId' });
  }
};
