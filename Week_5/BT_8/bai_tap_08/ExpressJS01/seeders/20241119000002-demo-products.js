'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy categories từ database để có đúng ID
    const [categories] = await queryInterface.sequelize.query(
      "SELECT id, name FROM Categories ORDER BY id"
    );
    
    // Tạo map category name -> id
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    console.log('Category IDs:', categoryMap);
    
    const laptopImages = [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      'https://images.unsplash.com/photo-1575909812264-6902b55846ad?w=500'
    ];

    const products = [
      // Category: Văn phòng (10 laptops)
      {
        name: 'Laptop Dell Inspiron 15 3520',
        description: 'CPU Intel Core i5-1235U, RAM 8GB DDR4, SSD 256GB, Màn hình 15.6 inch FHD, Windows 11',
        price: 12990000,
        image: laptopImages[0],
        stock: 25,
        categoryId: categoryMap['Văn phòng'] || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop HP Pavilion 15-eg2007TU',
        description: 'CPU Intel Core i5-1135G7, RAM 8GB DDR4, SSD 512GB, Màn hình 15.6 inch FHD IPS, Windows 11',
        price: 14990000,
        image: laptopImages[1],
        stock: 20,
        categoryId: categoryMap['Văn phòng'] || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Asus Vivobook 15 X1504ZA',
        description: 'CPU Intel Core i5-1240P, RAM 8GB DDR4, SSD 512GB, Màn hình 15.6 inch FHD, Windows 11',
        price: 15990000,
        image: laptopImages[2],
        stock: 18,
        categoryId: categoryMap['Văn phòng'] || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Lenovo IdeaPad 3 15IAU7',
        description: 'CPU Intel Core i3-1215U, RAM 8GB DDR4, SSD 256GB, Màn hình 15.6 inch FHD, Windows 11',
        price: 11990000,
        image: laptopImages[3],
        stock: 30,
        categoryId: categoryMap['Văn phòng'] || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Acer Aspire 5 A515-57',
        description: 'CPU Intel Core i5-1235U, RAM 8GB DDR4, SSD 512GB, Màn hình 15.6 inch FHD IPS, Windows 11',
        price: 13990000,
        image: laptopImages[4],
        stock: 22,
        categoryId: categoryMap['Văn phòng'] || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Dell Vostro 15 3520',
        description: 'CPU Intel Core i7-1255U, RAM 16GB DDR4, SSD 512GB, Màn hình 15.6 inch FHD, Windows 11 Pro',
        price: 19990000,
        image: laptopImages[5],
        stock: 15,
        categoryId: categoryMap['Văn phòng'] || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop HP 15s-fq5009TU',
        description: 'CPU Intel Core i3-1215U, RAM 8GB DDR4, SSD 256GB, Màn hình 15.6 inch FHD, Windows 11',
        price: 10990000,
        image: laptopImages[6],
        stock: 28,
        categoryId: categoryMap['Văn phòng'] || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Asus VivoBook 14 X1404ZA',
        description: 'CPU Intel Core i5-1240P, RAM 8GB DDR4, SSD 512GB, Màn hình 14 inch FHD, Windows 11',
        price: 14990000,
        image: laptopImages[7],
        stock: 20,
        categoryId: categoryMap['Văn phòng'] || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Lenovo ThinkPad E15 Gen 4',
        description: 'CPU AMD Ryzen 5 5625U, RAM 8GB DDR4, SSD 256GB, Màn hình 15.6 inch FHD, Windows 11 Pro',
        price: 17990000,
        image: laptopImages[0],
        stock: 12,
        categoryId: categoryMap['Văn phòng'] || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Acer Aspire 3 A315-59',
        description: 'CPU Intel Core i5-1235U, RAM 8GB DDR4, SSD 512GB, Màn hình 15.6 inch FHD, Windows 11',
        price: 12990000,
        image: laptopImages[1],
        stock: 25,
        categoryId: categoryMap['Văn phòng'] || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Category 2: Gaming (10 laptops)
      {
        name: 'Laptop Gaming MSI Stealth 18 HX AI A2XWIG',
        description: 'CPU Intel Ultra 9 275HX, RAM 32GB DDR5, SSD 2TB, Màn hình 18 inch UHD+ MiniLED 120Hz, RTX 5080 16GB',
        price: 82990000,
        image: laptopImages[2],
        stock: 5,
        categoryId: categoryMap['Gaming'] || 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Gaming Asus ROG Strix G16 G614JV',
        description: 'CPU Intel Core i7-13650HX, RAM 16GB DDR5, SSD 512GB, Màn hình 16 inch FHD 165Hz, RTX 4060 8GB',
        price: 32990000,
        image: laptopImages[3],
        stock: 10,
        categoryId: categoryMap['Gaming'] || 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Gaming MSI Katana 15 B13VGK',
        description: 'CPU Intel Core i7-13620H, RAM 16GB DDR5, SSD 512GB, Màn hình 15.6 inch FHD 144Hz, RTX 4070 8GB',
        price: 34990000,
        image: laptopImages[4],
        stock: 8,
        categoryId: categoryMap['Gaming'] || 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Gaming Lenovo Legion 5 15IAH7',
        description: 'CPU Intel Core i7-12700H, RAM 16GB DDR4, SSD 512GB, Màn hình 15.6 inch FHD 165Hz, RTX 3060 6GB',
        price: 27990000,
        image: laptopImages[5],
        stock: 12,
        categoryId: categoryMap['Gaming'] || 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Gaming Acer Predator Helios 16 PH16',
        description: 'CPU Intel Core i7-13700HX, RAM 16GB DDR5, SSD 1TB, Màn hình 16 inch WQXGA 165Hz, RTX 4060 8GB',
        price: 39990000,
        image: laptopImages[6],
        stock: 7,
        categoryId: categoryMap['Gaming'] || 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Gaming HP Victus 16-r0007TX',
        description: 'CPU Intel Core i5-12450H, RAM 8GB DDR4, SSD 512GB, Màn hình 16.1 inch FHD 144Hz, RTX 4050 6GB',
        price: 21990000,
        image: laptopImages[7],
        stock: 15,
        categoryId: categoryMap['Gaming'] || 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Gaming Asus TUF Gaming F15 FX507ZV',
        description: 'CPU Intel Core i7-12700H, RAM 16GB DDR4, SSD 512GB, Màn hình 15.6 inch FHD 144Hz, RTX 4060 8GB',
        price: 29990000,
        image: laptopImages[0],
        stock: 10,
        categoryId: categoryMap['Gaming'] || 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Gaming MSI GF63 Thin 12UC',
        description: 'CPU Intel Core i5-12450H, RAM 8GB DDR4, SSD 512GB, Màn hình 15.6 inch FHD 144Hz, RTX 3050 4GB',
        price: 18990000,
        image: laptopImages[1],
        stock: 18,
        categoryId: categoryMap['Gaming'] || 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Gaming Dell G15 5530',
        description: 'CPU Intel Core i7-13650HX, RAM 16GB DDR5, SSD 512GB, Màn hình 15.6 inch FHD 165Hz, RTX 4060 8GB',
        price: 31990000,
        image: laptopImages[2],
        stock: 9,
        categoryId: categoryMap['Gaming'] || 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Gaming Acer Nitro 5 AN515',
        description: 'CPU Intel Core i5-12500H, RAM 16GB DDR4, SSD 512GB, Màn hình 15.6 inch FHD 144Hz, RTX 3050 6GB',
        price: 22990000,
        image: laptopImages[3],
        stock: 14,
        categoryId: categoryMap['Gaming'] || 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Category 3: Đồ họa (10 laptops)
      {
        name: 'Laptop MacBook Pro 16 inch M3 Pro',
        description: 'Chip Apple M3 Pro 12-core, RAM 18GB, SSD 512GB, Màn hình 16.2 inch Liquid Retina XDR, macOS',
        price: 59990000,
        image: laptopImages[4],
        stock: 6,
        categoryId: categoryMap['Đồ họa'] || 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop MacBook Pro 14 inch M3',
        description: 'Chip Apple M3 8-core, RAM 18GB, SSD 512GB, Màn hình 14.2 inch Liquid Retina XDR, macOS',
        price: 49990000,
        image: laptopImages[5],
        stock: 8,
        categoryId: categoryMap['Đồ họa'] || 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Asus ProArt StudioBook 16 OLED',
        description: 'CPU Intel Core i9-13980HX, RAM 32GB DDR5, SSD 1TB, Màn hình 16 inch 3.2K OLED, RTX 4060 8GB',
        price: 69990000,
        image: laptopImages[6],
        stock: 4,
        categoryId: categoryMap['Đồ họa'] || 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Dell XPS 15 9530',
        description: 'CPU Intel Core i7-13700H, RAM 16GB DDR5, SSD 512GB, Màn hình 15.6 inch 3.5K OLED Touch, RTX 4050 6GB',
        price: 54990000,
        image: laptopImages[7],
        stock: 5,
        categoryId: categoryMap['Đồ họa'] || 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop HP ZBook Studio 16 G10',
        description: 'CPU Intel Core i7-13700H, RAM 32GB DDR5, SSD 1TB, Màn hình 16 inch 4K UHD, RTX 2000 Ada 8GB',
        price: 79990000,
        image: laptopImages[0],
        stock: 3,
        categoryId: categoryMap['Đồ họa'] || 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Lenovo ThinkPad P1 Gen 6',
        description: 'CPU Intel Core i7-13700H, RAM 32GB DDR5, SSD 1TB, Màn hình 16 inch 4K UHD, RTX 2000 Ada 8GB',
        price: 74990000,
        image: laptopImages[1],
        stock: 4,
        categoryId: categoryMap['Đồ họa'] || 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Asus ZenBook Pro 16X OLED',
        description: 'CPU Intel Core i9-13905H, RAM 32GB DDR5, SSD 1TB, Màn hình 16 inch 3.2K OLED Touch, RTX 4080 12GB',
        price: 89990000,
        image: laptopImages[2],
        stock: 2,
        categoryId: categoryMap['Đồ họa'] || 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop MacBook Air 15 inch M3',
        description: 'Chip Apple M3 8-core, RAM 16GB, SSD 512GB, Màn hình 15.3 inch Liquid Retina, macOS',
        price: 39990000,
        image: laptopImages[3],
        stock: 10,
        categoryId: categoryMap['Đồ họa'] || 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Dell Precision 5680',
        description: 'CPU Intel Core i7-13700H, RAM 32GB DDR5, SSD 1TB, Màn hình 16 inch 4K UHD Touch, RTX 2000 Ada 8GB',
        price: 84990000,
        image: laptopImages[4],
        stock: 3,
        categoryId: categoryMap['Đồ họa'] || 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop HP Spectre x360 16',
        description: 'CPU Intel Core i7-13700H, RAM 16GB DDR5, SSD 1TB, Màn hình 16 inch 3K OLED Touch, RTX 4050 6GB',
        price: 49990000,
        image: laptopImages[5],
        stock: 7,
        categoryId: categoryMap['Đồ họa'] || 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Category 4: Doanh nhân (10 laptops)
      {
        name: 'Laptop Dell XPS 13 Plus 9330',
        description: 'CPU Intel Core i7-1360P, RAM 16GB LPDDR5, SSD 512GB, Màn hình 13.4 inch FHD+ Touch, Windows 11 Pro',
        price: 39990000,
        image: laptopImages[6],
        stock: 8,
        categoryId: categoryMap['Doanh nhân'] || 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop HP EliteBook 840 G10',
        description: 'CPU Intel Core i7-1355U, RAM 16GB DDR5, SSD 512GB, Màn hình 14 inch FHD IPS, Windows 11 Pro',
        price: 32990000,
        image: laptopImages[7],
        stock: 10,
        categoryId: categoryMap['Doanh nhân'] || 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Lenovo ThinkPad X1 Carbon Gen 11',
        description: 'CPU Intel Core i7-1355U, RAM 16GB LPDDR5, SSD 512GB, Màn hình 14 inch 2.8K OLED, Windows 11 Pro',
        price: 44990000,
        image: laptopImages[0],
        stock: 6,
        categoryId: categoryMap['Doanh nhân'] || 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Asus ZenBook 14 UX3402',
        description: 'CPU Intel Core i7-1360P, RAM 16GB LPDDR5, SSD 512GB, Màn hình 14 inch 2.8K OLED, Windows 11',
        price: 34990000,
        image: laptopImages[1],
        stock: 9,
        categoryId: categoryMap['Doanh nhân'] || 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop MacBook Air 13 inch M3',
        description: 'Chip Apple M3 8-core, RAM 16GB, SSD 512GB, Màn hình 13.6 inch Liquid Retina, macOS',
        price: 34990000,
        image: laptopImages[2],
        stock: 12,
        categoryId: categoryMap['Doanh nhân'] || 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Dell Latitude 7440',
        description: 'CPU Intel Core i7-1355U, RAM 16GB DDR5, SSD 512GB, Màn hình 14 inch FHD Touch, Windows 11 Pro',
        price: 29990000,
        image: laptopImages[3],
        stock: 11,
        categoryId: categoryMap['Doanh nhân'] || 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop HP Dragonfly G4',
        description: 'CPU Intel Core i7-1355U, RAM 16GB LPDDR5, SSD 512GB, Màn hình 13.5 inch 3K2K Touch, Windows 11 Pro',
        price: 49990000,
        image: laptopImages[4],
        stock: 5,
        categoryId: categoryMap['Doanh nhân'] || 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Lenovo ThinkPad X13 Gen 4',
        description: 'CPU Intel Core i7-1355U, RAM 16GB LPDDR5, SSD 512GB, Màn hình 13.3 inch 2.8K OLED, Windows 11 Pro',
        price: 37990000,
        image: laptopImages[5],
        stock: 7,
        categoryId: categoryMap['Doanh nhân'] || 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Asus ExpertBook B9',
        description: 'CPU Intel Core i7-1355U, RAM 16GB LPDDR5, SSD 1TB, Màn hình 14 inch FHD IPS, Windows 11 Pro',
        price: 32990000,
        image: laptopImages[6],
        stock: 8,
        categoryId: categoryMap['Doanh nhân'] || 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop Microsoft Surface Laptop 5',
        description: 'CPU Intel Core i7-1255U, RAM 16GB LPDDR5, SSD 512GB, Màn hình 13.5 inch PixelSense Touch, Windows 11',
        price: 39990000,
        image: laptopImages[7],
        stock: 6,
        categoryId: categoryMap['Doanh nhân'] || 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Products', products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
