const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  cartItemId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cartId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
