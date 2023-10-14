const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  quizId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
