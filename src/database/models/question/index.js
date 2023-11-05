const BaseModel = require('../base');
const Quiz = require('../quiz');
const Answer = require('../answer');
module.exports = class Question extends BaseModel {
  static tableName = 'question';
  static modelName = 'Question';
  static include = [
    {
      model: Quiz,
      as: 'quiz',
    },
    {
      model: Answer,
      as: 'answers',
    },
  ];
  static schema = require('./schema');
  static associate = (models) => {
    this.belongsTo(models.Quiz, { foreignKey: 'quizId' });
    this.hasMany(models.Answer, { foreignKey: 'questionId' });
  };
};
