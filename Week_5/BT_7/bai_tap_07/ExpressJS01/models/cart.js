'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Cart thuộc về một User
      Cart.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      
      // Cart có nhiều CartItems
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cartId',
        as: 'items'
      });
    }
  }
  
  Cart.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'checkout', 'completed'),
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts'
  });
  
  return Cart;
};



