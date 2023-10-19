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
        for (let i = 0; i < permissions.length; i++) {
          console.log(i + 1 + ' ' + permissions[i]);
        }
      })
      .catch((err) => {
        console.log('Insert permissions fail:', err);
      });
  });
const insertPermissions = async (permissions) => {
  for (let i = 0; i < permissions.length; i++) {
    if (permissions[i + 1] == '/users/request-change-role/:id') {
      continue;
    }
    await queryInterface.bulkInsert('role_permission', [
      {
        method: 'GET',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        permissionId: i + 1, // Use the updated permissionId
        roleId: '2',
      },
    ]);
  }
};
