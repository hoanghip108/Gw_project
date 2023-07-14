const BaseModel = require('../base');
const SubCategory = require('../subCategory');

module.exports = class Category extends BaseModel {
  static modelName = 'Category';
  static tableName = 'Category';
  static schema = require('./schema');
  static include = [
    {
      model: SubCategory,
      as: 'subCategory',
    },
  ];
  static associate(models) {
    this.hasMany(models.SubCategory, { foreignKey: 'cateId' });
  }
};
