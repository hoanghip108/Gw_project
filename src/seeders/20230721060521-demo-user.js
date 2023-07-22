'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Role', [{
      roleId: '1',
      roleName: 'ADMIN',
      email: 'example@example.com',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
