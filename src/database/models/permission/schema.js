const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  permissionId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  canCread: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  canRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  canUpdate: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  canDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
};
