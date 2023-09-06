const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV1,
  },
  transactionCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(2),
    allowNull: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isTranfer: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
};
