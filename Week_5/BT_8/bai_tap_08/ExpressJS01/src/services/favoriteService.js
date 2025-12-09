const db = require('../../models');
const FavoriteProduct = db.FavoriteProduct;
const Product = db.Product;
const Category = db.Category;

// Thêm/xóa sản phẩm yêu thích
const toggleFavorite = async (userId, productId) => {
  try {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(productId);
    if (!product) {
      return { error: 'Sản phẩm không tồn tại' };
    }

    // Kiểm tra đã yêu thích chưa
    const existingFavorite = await FavoriteProduct.findOne({
      where: { userId, productId }
    });

    if (existingFavorite) {
      // Nếu đã yêu thích, xóa khỏi danh sách yêu thích
      await existingFavorite.destroy();
      return { isFavorite: false, message: 'Đã xóa khỏi danh sách yêu thích' };
    } else {
      // Nếu chưa yêu thích, thêm vào danh sách
      await FavoriteProduct.create({ userId, productId });
      return { isFavorite: true, message: 'Đã thêm vào danh sách yêu thích' };
    }
  } catch (error) {
    console.error('Lỗi toggleFavorite: ', error);
    return null;
  }
};

// Kiểm tra sản phẩm có trong danh sách yêu thích không
const checkFavorite = async (userId, productId) => {
  try {
    const favorite = await FavoriteProduct.findOne({
      where: { userId, productId }
    });
    return !!favorite;
  } catch (error) {
    console.error('Lỗi checkFavorite: ', error);
    return false;
  }
};

// Lấy danh sách sản phẩm yêu thích của user
const getFavorites = async (userId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await FavoriteProduct.findAndCountAll({
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
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    // Filter ra các sản phẩm đã bị xóa (null)
    const validFavorites = rows
      .filter(fav => fav.product !== null)
      .map(fav => fav.product);

    // Đếm lại số favorites hợp lệ
    const validCount = validFavorites.length;

    return {
      favorites: validFavorites,
      totalFavorites: validCount,
      totalPages: Math.ceil(validCount / limit),
      currentPage: parseInt(page)
    };
  } catch (error) {
    console.error('Lỗi getFavorites: ', error);
    return null;
  }
};

module.exports = {
  toggleFavorite,
  checkFavorite,
  getFavorites
};

