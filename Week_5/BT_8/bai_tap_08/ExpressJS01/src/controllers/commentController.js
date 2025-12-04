const {
  createComment,
  getComments,
  deleteComment
} = require('../services/commentService');

// Tạo bình luận mới
const createProductComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, content, rating } = req.body;

    if (!productId || !content) {
      return res.status(400).json({
        EC: 1,
        EM: 'productId và content là bắt buộc'
      });
    }

    const comment = await createComment(userId, parseInt(productId), content, rating);

    if (!comment) {
      return res.status(500).json({
        EC: -1,
        EM: 'Server error'
      });
    }

    if (comment.error) {
      return res.status(400).json({
        EC: 1,
        EM: comment.error
      });
    }

    return res.status(201).json({
      EC: 0,
      EM: 'Tạo bình luận thành công',
      data: comment
    });
  } catch (error) {
    console.error('createProductComment Error:', error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

// Lấy danh sách bình luận của sản phẩm
const getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const data = await getComments(parseInt(productId), page, limit);

    if (!data) {
      return res.status(500).json({
        EC: -1,
        EM: 'Server error'
      });
    }

    return res.status(200).json({
      EC: 0,
      EM: 'Get comments success',
      data
    });
  } catch (error) {
    console.error('getProductComments Error:', error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

// Xóa bình luận
const deleteProductComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'Admin';
    const { commentId } = req.params;

    const result = await deleteComment(parseInt(commentId), userId, isAdmin);

    if (!result) {
      return res.status(500).json({
        EC: -1,
        EM: 'Server error'
      });
    }

    if (result.error) {
      return res.status(403).json({
        EC: 1,
        EM: result.error
      });
    }

    return res.status(200).json({
      EC: 0,
      EM: 'Xóa bình luận thành công'
    });
  } catch (error) {
    console.error('deleteProductComment Error:', error);
    return res.status(500).json({ EC: -1, EM: 'Server error' });
  }
};

module.exports = {
  createProductComment,
  getProductComments,
  deleteProductComment
};

