'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Laptops',
        description: 'Máy tính xách tay các loại',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Smartphones',
        description: 'Điện thoại thông minh',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tablets',
        description: 'Máy tính bảng',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Accessories',
        description: 'Phụ kiện điện tử',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
