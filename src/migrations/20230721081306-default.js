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
      },{
        roleId: '3',
        roleName: 'Lecturer',
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
      },{
        cateId: '2',
        cateName: 'Music productions',
        isDeleted: 0,
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        cateId: '3',
        cateName: 'Music fundamentals',
        isDeleted: 0,
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        cateId: '4',
        cateName: 'Vocal',
        isDeleted: 0,
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },],
      queryInterface.bulkInsert('permission',[{
        permissionId: '1',
        api:'/users/disable',
        canCreate:1,
        canRead:1,
        canUpdate:1,
        canDelete:1,
        canPatch:1,
        isDeleted:0,
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId:1
      },{
        permissionId: '2',
        api:'/users',
        canCreate:1,
        canRead:1,
        canUpdate:1,
        canDelete:1,
        canPatch:1,
        isDeleted:0,
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId:1
      },{
        permissionId: '3',
        api:'/courses',
        canCreate:1,
        canRead:1,
        canUpdate:1,
        canDelete:1,
        canPatch:1,
        isDeleted:0,
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId:3
      },{
        permissionId: '4',
        api:'/lessons',
        canCreate:1,
        canRead:1,
        canUpdate:1,
        canDelete:1,
        canPatch:1,
        isDeleted:0,
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId:3
      },{
        permissionId: '5',
        api:'/lessons',
        canCreate:1,
        canRead:1,
        canUpdate:1,
        canDelete:1,
        canPatch:1,
        isDeleted:0,
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId:1
      },{
        permissionId: '6',
        api:'/courses',
        canCreate:1,
        canRead:1,
        canUpdate:1,
        canDelete:1,
        canPatch:1,
        isDeleted:0,
        createdBy:'ADMIN',
        updatedBy:'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId:1
      },
    ]))
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
