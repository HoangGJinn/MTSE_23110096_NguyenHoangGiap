'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FavoriteProduct extends Model {
    static associate(models) {
      FavoriteProduct.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      
      FavoriteProduct.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }
  
  FavoriteProduct.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
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
    }
  }, {
    sequelize,
    modelName: 'FavoriteProduct',
    tableName: 'FavoriteProducts'
  });
  
  return FavoriteProduct;
};

