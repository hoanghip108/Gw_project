const Sequelize = require("sequelize");
module.exports = {
  id: {
    type: Sequelize.STRING(36),
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  username: {
    type: Sequelize.STRING(32),
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING(250),
    allowNull: false,
  },
  firstName: {
    type: Sequelize.STRING(250),
    allowNull: true,
  },
  lastName: {
    type: Sequelize.STRING(250),
    allowNull: true,
  },
  managerId: {
    type: Sequelize.STRING(36),
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING(100),
    allowNull: true,
    unique: false,
  },
  phone: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  avatar: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },

  address: {
    type: Sequelize.STRING(500),
    allowNull: true,
  },
  isActive: {
    type: Sequelize.INTEGER(1),
    defaultValue: 1,
  },
};
