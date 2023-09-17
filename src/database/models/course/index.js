const BaseModel = require('../base');
const EnrolledCourse = require('../enrolledCourse');
const SubCategory = require('../subCategory');
const Section = require('../section');
const CartItem = require('../cartItem');
module.exports = class Course extends BaseModel {
  static tableName = 'Course';
  static modelName = 'Course';
  static schema = require('./schema');
  static include = [
    {
      model: EnrolledCourse,
      as: 'enrolledCourse',
    },
    { model: SubCategory, as: 'subCategory' },
    { model: Section, as: 'section' },
    { model: CartItem, as: 'cartItem' },
  ];
  static associate(models) {
    this.belongsTo(models.SubCategory, { foreignKey: 'subCateId' });
    this.hasMany(models.EnrolledCourse, { foreignKey: 'courseId' });
    this.hasMany(models.Section, { foreignKey: 'courseId' });
    this.hasMany(models.CartItem, { foreignKey: 'courseId' });
  }
};
