const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  answerId: {
    type: DataTypes.STRING,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
};
