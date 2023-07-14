const BaseModel = require('../base');
const Category = require('../category');
const Course = require('../course');
module.exports = class SubCategory extends BaseModel {
  static tableName = 'SubCategory';
  static modelName = 'SubCategory';
  static include = [
    {
      model: Category,
      as: 'category',
    },
    {
      model: Course,
      as: 'course',
    },
  ];
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.Category, { foreignKey: 'cateId' });
    this.hasMany(models.Course, { foreignKey: 'subCateId' });
  }
};
