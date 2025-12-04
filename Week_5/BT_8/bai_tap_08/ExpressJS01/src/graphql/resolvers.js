const jwt = require('jsonwebtoken');
const db = require('../../models');
const { User } = db;
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  toggleSelectCartItem,
  checkout
} = require('../services/cartService');

// Helper để lấy user từ token
const getUserFromToken = async (token) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });
    return user;
  } catch (error) {
    return null;
  }
};

// Helper để format cart response
const formatCart = (cart) => {
  if (!cart) return null;

  return {
    id: cart.id.toString(),
    userId: cart.userId,
    status: cart.status,
    items: cart.items ? cart.items.map(item => ({
      id: item.id.toString(),
      cartId: item.cartId,
      productId: item.productId,
      quantity: item.quantity,
      selected: item.selected,
      product: {
        id: item.product.id.toString(),
        name: item.product.name,
        description: item.product.description,
        price: parseFloat(item.product.price),
        image: item.product.image,
        stock: item.product.stock,
        categoryId: item.product.categoryId
      }
    })) : []
  };
};

const resolvers = {
  Query: {
    getCart: async (parent, args, context) => {
      try {
        const user = await getUserFromToken(context.token);
        if (!user) {
          throw new Error('Bạn cần đăng nhập để xem giỏ hàng');
        }

        const cart = await getCart(user.id);
        return formatCart(cart);
      } catch (error) {
        throw new Error(error.message || 'Lỗi khi lấy giỏ hàng');
      }
    }
  },

  Mutation: {
    addToCart: async (parent, { productId, quantity = 1 }, context) => {
      try {
        const user = await getUserFromToken(context.token);
        if (!user) {
          throw new Error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
        }

        const result = await addToCart(user.id, productId, quantity);
        
        return {
          success: result.success,
          message: result.message,
          cart: formatCart(result.cart)
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng',
          cart: null
        };
      }
    },

    updateCartItem: async (parent, { cartItemId, quantity }, context) => {
      try {
        const user = await getUserFromToken(context.token);
        if (!user) {
          throw new Error('Bạn cần đăng nhập để cập nhật giỏ hàng');
        }

        const result = await updateCartItem(user.id, cartItemId, quantity);
        
        return {
          success: result.success,
          message: result.message,
          cart: formatCart(result.cart)
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Lỗi khi cập nhật giỏ hàng',
          cart: null
        };
      }
    },

    removeFromCart: async (parent, { cartItemId }, context) => {
      try {
        const user = await getUserFromToken(context.token);
        if (!user) {
          throw new Error('Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng');
        }

        const result = await removeFromCart(user.id, cartItemId);
        
        return {
          success: result.success,
          message: result.message,
          cart: formatCart(result.cart)
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Lỗi khi xóa sản phẩm khỏi giỏ hàng',
          cart: null
        };
      }
    },

    toggleSelectCartItem: async (parent, { cartItemId, selected }, context) => {
      try {
        const user = await getUserFromToken(context.token);
        if (!user) {
          throw new Error('Bạn cần đăng nhập để chọn sản phẩm');
        }

        const result = await toggleSelectCartItem(user.id, cartItemId, selected);
        
        return {
          success: result.success,
          message: result.message,
          cart: formatCart(result.cart)
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Lỗi khi cập nhật trạng thái chọn',
          cart: null
        };
      }
    },

    checkout: async (parent, { cartItemIds }, context) => {
      try {
        const user = await getUserFromToken(context.token);
        if (!user) {
          throw new Error('Bạn cần đăng nhập để thanh toán');
        }

        const result = await checkout(user.id, cartItemIds);
        
        return {
          success: result.success,
          message: result.message,
          cart: formatCart(result.cart)
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || 'Lỗi khi thanh toán',
          cart: null
        };
      }
    }
  }
};

module.exports = resolvers;


