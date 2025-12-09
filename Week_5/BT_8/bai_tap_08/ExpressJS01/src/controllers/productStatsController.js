const {
  getProductStats,
  getSimilarProducts
} = require('../services/productStatsService');
const { getProductByIdService } = require('../services/productService');

// Lấy thống kê sản phẩm
const getStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const stats = await getProductStats(parseInt(productId));

    if (!stats) {
      return res.status(500).json({
        EC: -1,
        EM: 'Server error'
      });
    }

    return res.status(200).json({
      EC: 0,
      EM: 'Get stats success',
      data: stats
    });
  } catch (error) {
    console.error('getStats Error:', error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

// Lấy sản phẩm tương tự
const getSimilar = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 4 } = req.query;

    const products = await getSimilarProducts(parseInt(productId), limit);

    return res.status(200).json({
      EC: 0,
      EM: 'Get similar products success',
      data: products
    });
  } catch (error) {
    console.error('getSimilar Error:', error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

// Lấy chi tiết sản phẩm với thống kê và sản phẩm tương tự
const getProductDetailWithStats = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);
    const userId = req.user?.id;

    console.log('Getting product detail for id:', id, 'parsed:', productId, 'userId:', userId);

    if (isNaN(productId)) {
      return res.status(400).json({
        EC: 1,
        EM: 'ID sản phẩm không hợp lệ'
      });
    }

    const product = await getProductByIdService(productId, true);
    
    if (!product) {
      console.log('Product not found for id:', id);
      return res.status(404).json({
        EC: 1,
        EM: 'Sản phẩm không tồn tại'
      });
    }

    console.log('Product found:', product.id, product.name);

    // Lấy sản phẩm tương tự
    const similarProducts = await getSimilarProducts(parseInt(id), 4);
    console.log('Similar products count:', similarProducts.length);

    // Kiểm tra yêu thích nếu có user
    let isFavorite = false;
    if (userId) {
      try {
        const { checkFavorite } = require('../services/favoriteService');
        isFavorite = await checkFavorite(userId, parseInt(id));
      } catch (favError) {
        console.error('Error checking favorite:', favError);
        // Không fail request nếu check favorite lỗi
      }
    }

    const responseData = {
      product,
      similarProducts,
      isFavorite
    };

    console.log('Sending response with product id:', product.id);

    return res.status(200).json({
      EC: 0,
      EM: 'Get product detail success',
      data: responseData
    });
  } catch (error) {
    console.error('getProductDetailWithStats Error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ EC: -1, EM: 'Server error: ' + error.message });
  }
};

module.exports = {
  getStats,
  getSimilar,
  getProductDetailWithStats
};

