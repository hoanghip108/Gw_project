import bcrypt from 'bcrypt';
import { permissionId } from '../database/models/permission/schema';
import { create } from 'lodash';
import { v1 as uuidv1 } from 'uuid';
import hashPassword from '../helper/hashPassword';
const salt = bcrypt.genSaltSync(Number(process.env.SALTROUNDS));
const hash = bcrypt.hashSync('123123', salt);
const routes = require('../routes');
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const permission = await routes.getRoutePaths();
      await Promise.all([
        queryInterface.bulkInsert('role', [
          {
            roleId: '1',
            roleName: 'ADMIN',
            createdBy: 'ADMIN',
            updatedBy: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: '2',
            roleName: 'User',
            createdBy: 'ADMIN',
            updatedBy: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            roleId: '3',
            roleName: 'Lecturer',
            createdBy: 'ADMIN',
            updatedBy: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),

        queryInterface.bulkInsert('category', [
          {
            cateId: '1',
            cateName: 'Instruments',
            isDeleted: 0,
            createdBy: 'ADMIN',
            updatedBy: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            cateId: '2',
            cateName: 'Music productions',
            isDeleted: 0,
            createdBy: 'ADMIN',
            updatedBy: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            cateId: '3',
            cateName: 'Music fundamentals',
            isDeleted: 0,
            createdBy: 'ADMIN',
            updatedBy: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            cateId: '4',
            cateName: 'Vocal',
            isDeleted: 0,
            createdBy: 'ADMIN',
            updatedBy: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
        queryInterface.bulkInsert('user', [
          {
            id: '1',
            username: 'admin001',
            password: hashPassword('123123'),
            firstName: 'admin',
            lastName: 'admin',
            isActive: 1,
            createdBy: 'ADMIN',
            createdAt: new Date(),
          },
        ]),
        permission.forEach((route) => {
          queryInterface.bulkInsert('permission', [
            {
              permissionId: route,
              api: route,
              createdBy: 'ADMIN',
              createdAt: new Date(),
            },
          ]);
        }),
      ]);
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
