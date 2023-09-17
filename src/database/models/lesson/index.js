const BaseModel = require('../base');
const Course = require('../course');
const Section = require('../section');
module.exports = class Lesson extends BaseModel {
  static tableName = 'Lesson';
  static modelName = 'Lesson';
  static schema = require('./schema');
  static include = [
    {
      model: Section,
      as: 'section',
    },
  ];
  static associate(models) {
    this.belongsTo(models.Section, { foreignKey: 'sectionId' });
  }
};
