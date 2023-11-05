const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  cateId: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
  cateName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
