const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  messageId: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
