const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  courseId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true,
  },
  courseName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  like: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dislike: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isApprove: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  courseImg: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};
