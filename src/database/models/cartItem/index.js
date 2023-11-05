const Course = require('../course');
const Cart = require('../cart');
const BaseModel = require('../base');

module.exports = class CartItem extends BaseModel {
  static tableName = 'cartItem';
  static modelName = 'cartItem';
  static schema = require('./schema');
  static include = [
    {
      model: Course,
      as: 'course',
    },
    {
      model: Cart,
      as: 'cart',
    },
  ];
  static associate(models) {
    this.belongsTo(models.Course, {
      foreignKey: 'courseId',
    });
    this.belongsTo(models.Cart, {
      foreignKey: 'cartId',
    });
  }
};
