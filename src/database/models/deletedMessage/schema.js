const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  dMessageId: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
};
