const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  conversationId: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
