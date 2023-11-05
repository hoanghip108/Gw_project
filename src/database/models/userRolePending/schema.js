const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  isApproved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  introduction: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
