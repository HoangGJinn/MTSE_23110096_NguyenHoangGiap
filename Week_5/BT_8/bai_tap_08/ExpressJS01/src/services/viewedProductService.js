const db = require('../../models');
const ViewedProduct = db.ViewedProduct;
const Product = db.Product;
const Category = db.Category;
const { Op } = require('sequelize');

// Thêm sản phẩm vào danh sách đã xem
const addViewedProduct = async (userId, productId) => {
  try {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(productId);
    if (!product) {
      return { error: 'Sản phẩm không tồn tại' };
    }

    // Kiểm tra đã xem chưa (trong vòng 24h)
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const existingView = await ViewedProduct.findOne({
      where: {
        userId,
        productId,
        viewedAt: {
          [Op.gte]: oneDayAgo
        }
      }
    });

    if (!existingView) {
      // Nếu chưa xem hoặc đã xem quá 24h, tạo bản ghi mới
      await ViewedProduct.create({
        userId,
        productId,
        viewedAt: new Date()
      });
    } else {
      // Cập nhật thời gian xem
      await existingView.update({ viewedAt: new Date() });
    }

    return { success: true };
  } catch (error) {
    console.error('Lỗi addViewedProduct: ', error);
    return null;
  }
};

// Lấy danh sách sản phẩm đã xem của user
const getViewedProducts = async (userId, limit = 10) => {
  try {
    // Lấy nhiều hơn limit để có thể filter và vẫn đủ số lượng
    const viewedProducts = await ViewedProduct.findAll({
      where: { userId },
      include: [{
        model: Product,
        as: 'product',
        required: false, // LEFT JOIN để không bỏ qua records nếu product bị xóa
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }]
      }],
      limit: parseInt(limit) * 2, // Lấy nhiều hơn để filter
      order: [['viewedAt', 'DESC']]
    });

    // Loại bỏ trùng lặp sản phẩm (chỉ lấy lần xem gần nhất) và filter null products
    const uniqueProducts = [];
    const productIds = new Set();
    
    for (const viewed of viewedProducts) {
      // Chỉ lấy sản phẩm còn tồn tại và chưa có trong danh sách
      if (viewed.product && !productIds.has(viewed.productId)) {
        productIds.add(viewed.productId);
        // Convert Sequelize model to JSON
        const productJson = viewed.product.toJSON ? viewed.product.toJSON() : viewed.product;
        uniqueProducts.push(productJson);
        
        // Dừng khi đủ số lượng
        if (uniqueProducts.length >= parseInt(limit)) {
          break;
        }
      }
    }

    return uniqueProducts;
  } catch (error) {
    console.error('Lỗi getViewedProducts: ', error);
    console.error('Error stack:', error.stack);
    return null;
  }
};

module.exports = {
  addViewedProduct,
  getViewedProducts
};

