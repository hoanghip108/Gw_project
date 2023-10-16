const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  api: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
