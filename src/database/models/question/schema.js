const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  questionId: {
    type: DataTypes.STRING,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
