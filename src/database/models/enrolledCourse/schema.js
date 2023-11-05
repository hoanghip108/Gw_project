const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  enrolledCourseId: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV1,
    allowNull: false,
    primaryKey: true,
  },
};
