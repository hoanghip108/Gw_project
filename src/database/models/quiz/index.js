const BaseModel = require('../base');
const Section = require('../section');
const Questtion = require('../question');
const QuizResult = require('../quizResult');
module.exports = class Quiz extends BaseModel {
  static tableName = 'quiz';
  static modelName = 'Quiz';
  static include = [
    {
      model: Section,
      as: 'section',
    },
    {
      model: Questtion,
      as: 'questions',
    },
    {
      model: QuizResult,
      as: 'quizResults',
    },
  ];
  static schema = require('./schema');
  static associate = (models) => {
    this.belongsTo(models.Section, { foreignKey: 'sectionId' });
    this.hasMany(models.Question, { foreignKey: 'quizId' });
    this.hasMany(models.QuizResult, { foreignKey: 'quizId' });
  };
};
