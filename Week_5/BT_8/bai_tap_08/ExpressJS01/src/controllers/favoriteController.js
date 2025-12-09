const {
  toggleFavorite,
  checkFavorite,
  getFavorites
} = require('../services/favoriteService');

// Toggle favorite (thêm/xóa yêu thích)
const toggleFavoriteProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        EC: 1,
        EM: 'Vui lòng đăng nhập để sử dụng tính năng này'
      });
    }
    
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        EC: 1,
        EM: 'productId là bắt buộc'
      });
    }

    const result = await toggleFavorite(userId, parseInt(productId));

    if (!result) {
      return res.status(500).json({
        EC: -1,
        EM: 'Server error'
      });
    }

    if (result.error) {
      return res.status(400).json({
        EC: 1,
        EM: result.error
      });
    }

    return res.status(200).json({
      EC: 0,
      EM: result.message,
      data: {
        isFavorite: result.isFavorite
      }
    });
  } catch (error) {
    console.error('toggleFavoriteProduct Error:', error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

// Kiểm tra sản phẩm có trong danh sách yêu thích không
const checkFavoriteStatus = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        EC: 1,
        EM: 'Vui lòng đăng nhập để sử dụng tính năng này'
      });
    }
    
    const userId = req.user.id;
    const { productId } = req.params;

    const isFavorite = await checkFavorite(userId, parseInt(productId));

    return res.status(200).json({
      EC: 0,
      EM: 'Success',
      data: { isFavorite }
    });
  } catch (error) {
    console.error('checkFavoriteStatus Error:', error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

// Lấy danh sách sản phẩm yêu thích
const getFavoriteProducts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        EC: 1,
        EM: 'Vui lòng đăng nhập để sử dụng tính năng này'
      });
    }
    
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const data = await getFavorites(userId, page, limit);

    if (!data) {
      return res.status(500).json({
        EC: -1,
        EM: 'Server error'
      });
    }

    return res.status(200).json({
      EC: 0,
      EM: 'Get favorites success',
      data
    });
  } catch (error) {
    console.error('getFavoriteProducts Error:', error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

module.exports = {
  toggleFavoriteProduct,
  checkFavoriteStatus,
  getFavoriteProducts
};

