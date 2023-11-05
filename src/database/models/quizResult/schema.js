const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};
