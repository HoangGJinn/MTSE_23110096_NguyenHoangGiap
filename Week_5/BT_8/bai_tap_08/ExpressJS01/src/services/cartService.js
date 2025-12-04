require('dotenv').config();
const db = require('../../models');
const { Cart, CartItem, Product, User, Order } = db;

// Lấy hoặc tạo cart cho user
const getOrCreateCart = async (userId) => {
  try {
    let cart = await Cart.findOne({
      where: { userId, status: 'active' },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });

    if (!cart) {
      cart = await Cart.create({ userId, status: 'active' });
    }

    return cart;
  } catch (error) {
    console.log('Lỗi getOrCreateCart: ', error);
    return null;
  }
};

// Lấy cart của user
const getCart = async (userId) => {
  try {
    const cart = await Cart.findOne({
      where: { userId, status: 'active' },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });

    return cart;
  } catch (error) {
    console.log('Lỗi getCart: ', error);
    return null;
  }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (userId, productId, quantity = 1) => {
  try {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(productId);
    if (!product) {
      return {
        success: false,
        message: 'Sản phẩm không tồn tại'
      };
    }

    // Kiểm tra số lượng tồn kho
    if (product.stock < quantity) {
      return {
        success: false,
        message: 'Số lượng sản phẩm không đủ'
      };
    }

    // Lấy hoặc tạo cart
    const cart = await getOrCreateCart(userId);

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (cartItem) {
      // Cập nhật số lượng
      const newQuantity = cartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return {
          success: false,
          message: 'Số lượng sản phẩm không đủ'
        };
      }
      await cartItem.update({ quantity: newQuantity });
    } else {
      // Tạo mới cart item
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        selected: false
      });
    }

    // Lấy lại cart với items mới
    const updatedCart = await getCart(userId);

    return {
      success: true,
      message: 'Thêm sản phẩm vào giỏ hàng thành công',
      cart: updatedCart
    };
  } catch (error) {
    console.log('Lỗi addToCart: ', error);
    return {
      success: false,
      message: 'Lỗi server'
    };
  }
};

// Cập nhật số lượng sản phẩm trong giỏ
const updateCartItem = async (userId, cartItemId, quantity) => {
  try {
    if (quantity < 1) {
      return {
        success: false,
        message: 'Số lượng phải lớn hơn 0'
      };
    }

    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [{
        model: Cart,
        as: 'cart'
      }, {
        model: Product,
        as: 'product'
      }]
    });

    if (!cartItem) {
      return {
        success: false,
        message: 'Sản phẩm không tồn tại trong giỏ hàng'
      };
    }

    // Kiểm tra quyền sở hữu
    if (cartItem.cart.userId !== userId) {
      return {
        success: false,
        message: 'Không có quyền thực hiện'
      };
    }

    // Kiểm tra số lượng tồn kho
    if (cartItem.product.stock < quantity) {
      return {
        success: false,
        message: 'Số lượng sản phẩm không đủ'
      };
    }

    await cartItem.update({ quantity });

    const updatedCart = await getCart(userId);

    return {
      success: true,
      message: 'Cập nhật giỏ hàng thành công',
      cart: updatedCart
    };
  } catch (error) {
    console.log('Lỗi updateCartItem: ', error);
    return {
      success: false,
      message: 'Lỗi server'
    };
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (userId, cartItemId) => {
  try {
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [{
        model: Cart,
        as: 'cart'
      }]
    });

    if (!cartItem) {
      return {
        success: false,
        message: 'Sản phẩm không tồn tại trong giỏ hàng'
      };
    }

    // Kiểm tra quyền sở hữu
    if (cartItem.cart.userId !== userId) {
      return {
        success: false,
        message: 'Không có quyền thực hiện'
      };
    }

    await cartItem.destroy();

    const updatedCart = await getCart(userId);

    return {
      success: true,
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
      cart: updatedCart
    };
  } catch (error) {
    console.log('Lỗi removeFromCart: ', error);
    return {
      success: false,
      message: 'Lỗi server'
    };
  }
};

// Chọn/bỏ chọn sản phẩm để thanh toán
const toggleSelectCartItem = async (userId, cartItemId, selected) => {
  try {
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [{
        model: Cart,
        as: 'cart'
      }]
    });

    if (!cartItem) {
      return {
        success: false,
        message: 'Sản phẩm không tồn tại trong giỏ hàng'
      };
    }

    // Kiểm tra quyền sở hữu
    if (cartItem.cart.userId !== userId) {
      return {
        success: false,
        message: 'Không có quyền thực hiện'
      };
    }

    await cartItem.update({ selected });

    const updatedCart = await getCart(userId);

    return {
      success: true,
      message: 'Cập nhật trạng thái chọn thành công',
      cart: updatedCart
    };
  } catch (error) {
    console.log('Lỗi toggleSelectCartItem: ', error);
    return {
      success: false,
      message: 'Lỗi server'
    };
  }
};

// Thanh toán các sản phẩm đã chọn
const checkout = async (userId, cartItemIds) => {
  try {
    const cart = await getCart(userId);
    
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        success: false,
        message: 'Giỏ hàng trống'
      };
    }

    // Lọc các sản phẩm được chọn
    let itemsToCheckout = cart.items;
    if (cartItemIds && cartItemIds.length > 0) {
      itemsToCheckout = cart.items.filter(item => 
        cartItemIds.includes(item.id) && item.selected
      );
    } else {
      itemsToCheckout = cart.items.filter(item => item.selected);
    }

    if (itemsToCheckout.length === 0) {
      return {
        success: false,
        message: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán'
      };
    }

    // Kiểm tra số lượng tồn kho
    for (const item of itemsToCheckout) {
      if (item.product.stock < item.quantity) {
        return {
          success: false,
          message: `Sản phẩm ${item.product.name} không đủ số lượng tồn kho`
        };
      }
    }

    // Cập nhật số lượng tồn kho, tạo Order và xóa các sản phẩm đã thanh toán
    for (const item of itemsToCheckout) {
      // Cập nhật số lượng tồn kho
      await Product.update(
        { stock: item.product.stock - item.quantity },
        { where: { id: item.productId } }
      );
      
      // Tạo Order để theo dõi số khách mua
      await Order.create({
        userId: userId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        status: 'completed'
      });
      
      // Xóa item khỏi cart
      await item.destroy();
    }

    // Nếu giỏ hàng trống, đánh dấu là completed
    const remainingItems = await CartItem.count({ where: { cartId: cart.id } });
    if (remainingItems === 0) {
      await cart.update({ status: 'completed' });
    }

    const updatedCart = await getCart(userId);

    return {
      success: true,
      message: 'Thanh toán thành công',
      cart: updatedCart
    };
  } catch (error) {
    console.log('Lỗi checkout: ', error);
    return {
      success: false,
      message: 'Lỗi server'
    };
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  toggleSelectCartItem,
  checkout
};


