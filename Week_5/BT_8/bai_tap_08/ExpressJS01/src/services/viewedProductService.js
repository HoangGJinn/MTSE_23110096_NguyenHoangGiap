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
    const viewedProducts = await ViewedProduct.findAll({
      where: { userId },
      include: [{
        model: Product,
        as: 'product',
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }]
      }],
      limit: parseInt(limit),
      order: [['viewedAt', 'DESC']],
      distinct: true
    });

    // Loại bỏ trùng lặp sản phẩm (chỉ lấy lần xem gần nhất) và filter null products
    const uniqueProducts = [];
    const productIds = new Set();
    
    for (const viewed of viewedProducts) {
      if (viewed.product && !productIds.has(viewed.productId)) {
        productIds.add(viewed.productId);
        uniqueProducts.push(viewed.product);
      }
    }

    return uniqueProducts;
  } catch (error) {
    console.error('Lỗi getViewedProducts: ', error);
    return null;
  }
};

module.exports = {
  addViewedProduct,
  getViewedProducts
};

