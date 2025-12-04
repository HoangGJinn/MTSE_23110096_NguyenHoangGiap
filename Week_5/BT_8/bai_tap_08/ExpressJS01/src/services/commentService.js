const db = require('../../models');
const Comment = db.Comment;
const Product = db.Product;
const User = db.User;

// Tạo bình luận mới
const createComment = async (userId, productId, content, rating = null) => {
  try {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(productId);
    if (!product) {
      return { error: 'Sản phẩm không tồn tại' };
    }

    if (!content || content.trim() === '') {
      return { error: 'Nội dung bình luận không được để trống' };
    }

    const comment = await Comment.create({
      userId,
      productId,
      content: content.trim(),
      rating
    });

    // Lấy comment với thông tin user
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    return commentWithUser;
  } catch (error) {
    console.error('Lỗi createComment: ', error);
    return null;
  }
};

// Lấy danh sách bình luận của sản phẩm
const getComments = async (productId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Comment.findAndCountAll({
      where: { productId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return {
      comments: rows,
      totalComments: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    };
  } catch (error) {
    console.error('Lỗi getComments: ', error);
    return null;
  }
};

// Xóa bình luận (chỉ user tạo bình luận hoặc admin mới xóa được)
const deleteComment = async (commentId, userId, isAdmin = false) => {
  try {
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      return { error: 'Bình luận không tồn tại' };
    }

    // Kiểm tra quyền xóa
    if (!isAdmin && comment.userId !== userId) {
      return { error: 'Bạn không có quyền xóa bình luận này' };
    }

    await comment.destroy();
    return { success: true };
  } catch (error) {
    console.error('Lỗi deleteComment: ', error);
    return null;
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment
};

