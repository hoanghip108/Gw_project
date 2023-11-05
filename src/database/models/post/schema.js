const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
  postId: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV1,
    allowNull: false,
    primaryKey: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
