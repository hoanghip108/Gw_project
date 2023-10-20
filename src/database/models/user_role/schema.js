const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  roleId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};
