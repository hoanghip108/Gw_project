const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  participantId: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
};
