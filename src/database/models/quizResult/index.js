const BaseModel = require('../base');
const Quiz = require('../quiz');
const User = require('../user');
module.exports = class QuizResult extends BaseModel {
  static tableName = 'quizResult';
  static modelName = 'QuizResult';
  static include = [
    {
      model: Quiz,
      as: 'quiz',
    },
    {
      model: User,
      as: 'user',
    },
  ];
  static schema = require('./schema');
  static associate = (models) => {
    this.belongsTo(models.Quiz, { foreignKey: 'quizId' });
    this.belongsTo(models.User, { foreignKey: 'userId' });
  };
};
