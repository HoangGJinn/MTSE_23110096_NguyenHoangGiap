'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      // CartItem thuộc về một Cart
      CartItem.belongsTo(models.Cart, {
        foreignKey: 'cartId',
        as: 'cart'
      });
      
      // CartItem thuộc về một Product
      CartItem.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }
  
  CartItem.init({
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Carts',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    selected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'CartItem',
    tableName: 'CartItems'
  });
  
  return CartItem;
};



