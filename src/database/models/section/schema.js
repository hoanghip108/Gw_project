const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  sectionId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  sectionName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
};
