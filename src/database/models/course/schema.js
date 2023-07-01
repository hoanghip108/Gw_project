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
};
