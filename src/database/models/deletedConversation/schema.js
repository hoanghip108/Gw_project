const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  dConversationId: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
};
