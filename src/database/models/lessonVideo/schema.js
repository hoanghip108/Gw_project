const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  lessonVideoId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: DataTypes.UUIDV1,
  },
  videoName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoPath: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
};
