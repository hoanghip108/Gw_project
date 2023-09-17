const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  lessonId: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV1,
    allowNull: false,
    primaryKey: true,
  },
  lessonName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoPath: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
};
