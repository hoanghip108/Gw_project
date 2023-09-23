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
        await queryInterface.bulkInsert('role', [
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
            roleName: 'Client',
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

        await queryInterface.bulkInsert('category', [
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
        await queryInterface.bulkInsert('user', [
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
          {
            id: 2,
            username: 'client001',
            password: hashPassword('123123'),
            firstName: 'client',
            lastName: 'client',
            isActive: 1,
            createdBy: 'ADMIN',
            createdAt: new Date(),
          },
          {
            id: 3,
            username: 'lecturer001',
            password: hashPassword('123123'),
            firstName: 'lecturer',
            lastName: 'lecturer',
            isActive: 1,
            createdBy: 'ADMIN',
            createdAt: new Date(),
          },
        ]),
        await queryInterface.bulkInsert('user_role', [
          {
            userId: '1',
            roleId: '1',
            createdBy: 'ADMIN',
            createdAt: new Date(),
          },
        ]),
        permission.forEach(async (route) => {
          await queryInterface.bulkInsert('permission', [
            {
              permissionId: route,
              api: route,
              createdBy: 'ADMIN',
              createdAt: new Date(),
            },
          ]);
          await queryInterface.bulkInsert('role_permission', [
            {
              method: 'GET,POST,PUT,DELETE,PATH',
              createdBy: 'ADMIN',
              createdAt: new Date(),
              permissionId: route,
              roleId: '1',
            },
          ]);
        }),

        await queryInterface.bulkInsert('subCategory', [
          {
            subCateId: '1',
            subCateName: 'Guitar',
            isDeleted: 0,
            createdBy: 'ADMIN',
            createdAt: new Date(),
            cateId: '1',
          },
          {
            subCateId: '2',
            subCateName: 'Launchpad',
            isDeleted: 0,
            createdBy: 'ADMIN',
            createdAt: new Date(),
            cateId: '1',
          },
        ]),
        await queryInterface.bulkInsert('course', [
          {
            courseId: '1',
            courseName: 'Guitar for beginners',
            description: 'Guitar for beginners',
            price: 100000,
            isFree: 0,
            like: 0,
            dislike: 0,
            isDeleted: 0,
            createdBy: 'ADMIN',
            createdAt: new Date(),
            subCateId: '1',
          },
        ]),
        // await queryInterface.bulkInsert('role_permission', [
        //   {
        //     method: 'GET,POST,PUT,DELETE,PATH',
        //     createdBy: 'ADMIN',
        //     createdAt: new Date(),
        //     permissionId: '/users',
        //     roleId: '1',
        //   },
        //   {
        //     method: 'GET,POST,PUT,DELETE,PATH',
        //     createdBy: 'ADMIN',
        //     createdAt: new Date(),
        //     permissionId: '/categories',
        //     roleId: '1',
        //   },
        //   {
        //     method: 'GET,POST,PUT,DELETE,PATH',
        //     createdBy: 'ADMIN',
        //     createdAt: new Date(),
        //     permissionId: '/conversations',
        //     roleId: '1',
        //   },
        //   {
        //     method: 'GET,POST,PUT,DELETE,PATH',
        //     createdBy: 'ADMIN',
        //     createdAt: new Date(),
        //     permissionId: '/courses',
        //     roleId: '1',
        //   },
        //   {
        //     method: 'GET,POST,PUT,DELETE,PATH',
        //     createdBy: 'ADMIN',
        //     createdAt: new Date(),
        //     permissionId: '/lessons',
        //     roleId: '1',
        //   },
        //   {
        //     method: 'GET,POST,PUT,DELETE,PATH',
        //     createdBy: 'ADMIN',
        //     createdAt: new Date(),
        //     permissionId: '/sections',
        //     roleId: '1',
        //   },
        //   {
        //     method: 'GET,POST,PUT,DELETE,PATH',
        //     createdBy: 'ADMIN',
        //     createdAt: new Date(),
        //     permissionId: '/sub-categories',
        //     roleId: '1',
        //   },
        // ]),
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
