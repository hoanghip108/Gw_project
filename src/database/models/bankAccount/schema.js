const Sequelize = require("sequelize");
module.exports = {
  bankAccountId: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  accountNumber: {
    type: Sequelize.INTEGER(20),
    allowNull: false,
  },
  accountHolder: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};
