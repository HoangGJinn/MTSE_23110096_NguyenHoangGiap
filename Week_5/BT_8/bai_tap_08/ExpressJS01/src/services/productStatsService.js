const db = require('../../models');
const Product = db.Product;
const Order = db.Order;
const Comment = db.Comment;
const Category = db.Category;
const { Op } = require('sequelize');
const sequelize = db.sequelize;

// Lấy số khách đã mua sản phẩm (số user khác nhau đã mua)
const getPurchaseCount = async (productId) => {
  try {
    // Lấy tất cả orders và đếm số user khác nhau
    const orders = await Order.findAll({
      where: {
        productId,
        status: 'completed'
      },
      attributes: ['userId'],
      raw: true
    });

    // Lấy unique userIds
    const uniqueUserIds = new Set(orders.map(order => order.userId));
    return uniqueUserIds.size;
  } catch (error) {
    console.error('Lỗi getPurchaseCount: ', error);
    return 0;
  }
};

// Lấy số bình luận của sản phẩm
const getCommentCount = async (productId) => {
  try {
    const count = await Comment.count({
      where: { productId }
    });

    return count;
  } catch (error) {
    console.error('Lỗi getCommentCount: ', error);
    return 0;
  }
};

// Lấy thống kê tổng hợp cho sản phẩm
const getProductStats = async (productId) => {
  try {
    const [purchaseCount, commentCount] = await Promise.all([
      getPurchaseCount(productId),
      getCommentCount(productId)
    ]);

    return {
      purchaseCount,
      commentCount
    };
  } catch (error) {
    console.error('Lỗi getProductStats: ', error);
    return null;
  }
};

// Lấy sản phẩm tương tự (cùng category, loại trừ sản phẩm hiện tại)
const getSimilarProducts = async (productId, limit = 4) => {
  try {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return [];
    }

    const similarProducts = await Product.findAll({
      where: {
        categoryId: product.categoryId,
        id: {
          [Op.ne]: productId
        }
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      limit: parseInt(limit),
      order: sequelize.literal('RAND()') // Sắp xếp ngẫu nhiên (MySQL)
    });

    return similarProducts;
  } catch (error) {
    console.error('Lỗi getSimilarProducts: ', error);
    return [];
  }
};

// Lấy thống kê cho nhiều sản phẩm cùng lúc
const getMultipleProductStats = async (productIds) => {
  try {
    const stats = await Promise.all(
      productIds.map(async (id) => {
        const stat = await getProductStats(id);
        return { productId: id, ...stat };
      })
    );

    return stats;
  } catch (error) {
    console.error('Lỗi getMultipleProductStats: ', error);
    return null;
  }
};

module.exports = {
  getPurchaseCount,
  getCommentCount,
  getProductStats,
  getSimilarProducts,
  getMultipleProductStats
};

