const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  subCateId: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
  subCateName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
