'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Văn phòng',
        description: 'Laptop văn phòng với hiệu năng ổn định, phù hợp cho công việc hàng ngày',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gaming',
        description: 'Laptop gaming hiệu năng cao, card đồ họa mạnh mẽ cho trải nghiệm chơi game tuyệt vời',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Đồ họa',
        description: 'Laptop chuyên đồ họa với màn hình chất lượng cao, phù hợp cho thiết kế và chỉnh sửa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Doanh nhân',
        description: 'Laptop doanh nhân cao cấp, mỏng nhẹ, bảo mật tốt, phù hợp cho công việc chuyên nghiệp',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
