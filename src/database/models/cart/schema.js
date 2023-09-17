const { DataTypes, Sequelize } = require('sequelize');
module.exports = {
  carId: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
};
