const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  conversationId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};
