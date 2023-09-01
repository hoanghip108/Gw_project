const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  permissionId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  api: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
