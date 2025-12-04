import { gql } from '@apollo/client';

// Query để lấy giỏ hàng
export const GET_CART = gql`
  query GetCart {
    getCart {
      id
      userId
      status
      items {
        id
        cartId
        productId
        quantity
        selected
        product {
          id
          name
          description
          price
          image
          stock
          categoryId
        }
      }
    }
  }
`;

// Mutation để thêm sản phẩm vào giỏ hàng
export const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!, $quantity: Int) {
    addToCart(productId: $productId, quantity: $quantity) {
      success
      message
      cart {
        id
        userId
        status
        items {
          id
          cartId
          productId
          quantity
          selected
          product {
            id
            name
            description
            price
            image
            stock
            categoryId
          }
        }
      }
    }
  }
`;

// Mutation để cập nhật số lượng sản phẩm
export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($cartItemId: Int!, $quantity: Int!) {
    updateCartItem(cartItemId: $cartItemId, quantity: $quantity) {
      success
      message
      cart {
        id
        userId
        status
        items {
          id
          cartId
          productId
          quantity
          selected
          product {
            id
            name
            description
            price
            image
            stock
            categoryId
          }
        }
      }
    }
  }
`;

// Mutation để xóa sản phẩm khỏi giỏ hàng
export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartItemId: Int!) {
    removeFromCart(cartItemId: $cartItemId) {
      success
      message
      cart {
        id
        userId
        status
        items {
          id
          cartId
          productId
          quantity
          selected
          product {
            id
            name
            description
            price
            image
            stock
            categoryId
          }
        }
      }
    }
  }
`;

// Mutation để chọn/bỏ chọn sản phẩm
export const TOGGLE_SELECT_CART_ITEM = gql`
  mutation ToggleSelectCartItem($cartItemId: Int!, $selected: Boolean!) {
    toggleSelectCartItem(cartItemId: $cartItemId, selected: $selected) {
      success
      message
      cart {
        id
        userId
        status
        items {
          id
          cartId
          productId
          quantity
          selected
          product {
            id
            name
            description
            price
            image
            stock
            categoryId
          }
        }
      }
    }
  }
`;

// Mutation để thanh toán
export const CHECKOUT = gql`
  mutation Checkout($cartItemIds: [Int!]) {
    checkout(cartItemIds: $cartItemIds) {
      success
      message
      cart {
        id
        userId
        status
        items {
          id
          cartId
          productId
          quantity
          selected
          product {
            id
            name
            description
            price
            image
            stock
            categoryId
          }
        }
      }
    }
  }
`;



