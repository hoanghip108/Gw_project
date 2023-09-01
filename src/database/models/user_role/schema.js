const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  //   primaryKey: ['roleId', 'permissionId'],
};
