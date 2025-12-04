const {
  addViewedProduct,
  getViewedProducts
} = require('../services/viewedProductService');

// Thêm sản phẩm vào danh sách đã xem
const addToViewed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        EC: 1,
        EM: 'productId là bắt buộc'
      });
    }

    const result = await addViewedProduct(userId, parseInt(productId));

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
      EM: 'Đã thêm vào danh sách đã xem',
      data: result
    });
  } catch (error) {
    console.error('addToViewed Error:', error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

// Lấy danh sách sản phẩm đã xem
const getViewedProductsList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    console.log('getViewedProductsList - User ID:', userId, 'Limit:', limit);

    const products = await getViewedProducts(userId, limit);

    if (products === null) {
      return res.status(500).json({
        EC: -1,
        EM: 'Server error'
      });
    }

    // Trả về mảng rỗng nếu không có sản phẩm nào
    return res.status(200).json({
      EC: 0,
      EM: 'Get viewed products success',
      data: products || []
    });
  } catch (error) {
    console.error('getViewedProductsList Error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      EC: -1, 
      EM: 'Server error: ' + (error.message || 'Unknown error') 
    });
  }
};

module.exports = {
  addToViewed,
  getViewedProductsList
};

