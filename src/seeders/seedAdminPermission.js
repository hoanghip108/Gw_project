import { getRoutePatchs } from '../routes/index';
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const queryInterface = sequelize.getQueryInterface();
const data = getRoutePatchs()
  .then((permissions) => {
    return permissions;
  })
  .then((permissions) => {
    insertPermissions(permissions)
      .then(() => {
        console.log('Insert permissions successfully.');
      })
      .catch((err) => {
        console.log('Insert permissions fail:', err);
      });
  });
const insertPermissions = async (permissions) => {
  for (let i = 0; i < permissions.length; i++) {
    await queryInterface.bulkInsert('role_permission', [
      {
        method: 'GET,POST,PUT,DELETE,PATCH',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        permissionId: i + 1, // Use the updated permissionId
        roleId: '1',
      },
    ]);
  }
};

export default insertPermissions;
