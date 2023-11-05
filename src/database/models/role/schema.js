const Sequelize = require("sequelize");
module.exports = {
  roleId: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  roleName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};
