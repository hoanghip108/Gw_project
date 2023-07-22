'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.bulkInsert('role', [{
        roleId: '1',
        roleName: 'ADMIN',
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        roleId: '2',
        roleName: 'User',
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      }]),
      queryInterface.bulkInsert('category', [{
        cateId: '1',
        cateName: 'Instruments',
        isDeleted: 0,
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      }])
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
