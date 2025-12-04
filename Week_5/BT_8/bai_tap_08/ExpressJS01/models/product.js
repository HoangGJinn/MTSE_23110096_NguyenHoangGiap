'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Product thuộc về một Category
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      });
      
      // Product có nhiều FavoriteProducts
      Product.hasMany(models.FavoriteProduct, {
        foreignKey: 'productId',
        as: 'favorites'
      });
      
      // Product có nhiều ViewedProducts
      Product.hasMany(models.ViewedProduct, {
        foreignKey: 'productId',
        as: 'views'
      });
      
      // Product có nhiều Comments
      Product.hasMany(models.Comment, {
        foreignKey: 'productId',
        as: 'comments'
      });
      
      // Product có nhiều Orders
      Product.hasMany(models.Order, {
        foreignKey: 'productId',
        as: 'orders'
      });
    }
  }
  
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products'
  });
  
  return Product;
};
