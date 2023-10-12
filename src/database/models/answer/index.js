const BaseModel = require('../base');
const Question = require('../question');

module.exports = class Answer extends BaseModel {
  static tableName = 'answer';
  static modelName = 'Answer';
  static include = [
    {
      model: Question,
      as: 'question',
    },
  ];
  static schema = require('./schema');
  static associate = (models) => {
    this.belongsTo(models.Question, { foreignKey: 'questionId' });
  };
};
