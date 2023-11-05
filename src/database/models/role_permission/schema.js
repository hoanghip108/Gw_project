const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
