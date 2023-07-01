const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  rolePermissionId: {
    type: DataTypes.STRING,
    defaultValue: Sequelize.UUIDV1,
    primaryKey: true,
  },
};
