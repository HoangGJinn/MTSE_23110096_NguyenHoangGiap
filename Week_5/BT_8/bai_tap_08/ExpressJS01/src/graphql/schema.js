const typeDefs = `
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    image: String
    stock: Int!
    categoryId: Int!
  }

  type CartItem {
    id: ID!
    cartId: Int!
    productId: Int!
    quantity: Int!
    selected: Boolean!
    product: Product!
  }

  type Cart {
    id: ID!
    userId: Int!
    status: String!
    items: [CartItem!]!
  }

  type CartResponse {
    success: Boolean!
    message: String!
    cart: Cart
  }

  type Query {
    # Lấy giỏ hàng của user hiện tại
    getCart: Cart
  }

  type Mutation {
    # Thêm sản phẩm vào giỏ hàng
    addToCart(productId: Int!, quantity: Int): CartResponse!
    
    # Cập nhật số lượng sản phẩm trong giỏ
    updateCartItem(cartItemId: Int!, quantity: Int!): CartResponse!
    
    # Xóa sản phẩm khỏi giỏ hàng
    removeFromCart(cartItemId: Int!): CartResponse!
    
    # Chọn/bỏ chọn sản phẩm để thanh toán
    toggleSelectCartItem(cartItemId: Int!, selected: Boolean!): CartResponse!
    
    # Thanh toán các sản phẩm đã chọn
    checkout(cartItemIds: [Int!]): CartResponse!
  }
`;

module.exports = typeDefs;

