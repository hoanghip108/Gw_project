const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  quizId: {
    type: DataTypes.STRING,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
