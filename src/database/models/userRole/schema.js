const Sequelize = require('sequelize');

module.exports = {
  userRoleId: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
};
