'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const laptopImages = [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'
    ];

    const products = [];
    
    // Laptops (Category ID: 1) - 15 products
    for (let i = 1; i <= 15; i++) {
      products.push({
        name: `Laptop ${['Dell', 'HP', 'Asus', 'Lenovo', 'Acer'][i % 5]} Model ${i}`,
        description: `Laptop hiệu năng cao với cấu hình mạnh mẽ, phù hợp cho công việc và giải trí`,
        price: 15000000 + (i * 1000000),
        image: laptopImages[i % 5],
        stock: Math.floor(Math.random() * 50) + 10,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Smartphones (Category ID: 2) - 12 products
    for (let i = 1; i <= 12; i++) {
      products.push({
        name: `Smartphone ${['iPhone', 'Samsung', 'Xiaomi', 'Oppo'][i % 4]} ${i}`,
        description: `Điện thoại thông minh với camera chất lượng cao và hiệu năng tuyệt vời`,
        price: 8000000 + (i * 500000),
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        stock: Math.floor(Math.random() * 100) + 20,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Tablets (Category ID: 3) - 8 products
    for (let i = 1; i <= 8; i++) {
      products.push({
        name: `Tablet ${['iPad', 'Samsung Tab', 'Huawei'][i % 3]} ${i}`,
        description: `Máy tính bảng mỏng nhẹ, tiện lợi cho học tập và giải trí`,
        price: 6000000 + (i * 500000),
        image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
        stock: Math.floor(Math.random() * 30) + 10,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Accessories (Category ID: 4) - 10 products
    for (let i = 1; i <= 10; i++) {
      products.push({
        name: `Phụ kiện ${['Chuột', 'Bàn phím', 'Tai nghe', 'Sạc', 'Cáp'][i % 5]} ${i}`,
        description: `Phụ kiện chất lượng cao, tương thích với nhiều thiết bị`,
        price: 200000 + (i * 100000),
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        stock: Math.floor(Math.random() * 200) + 50,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Products', products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
