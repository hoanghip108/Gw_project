const User = require('../user');
const CartItem = require('../cartItem');
const BaseModel = require('../base');
module.exports = class Cart extends BaseModel {
  static tableName = 'cart';
  static modelName = 'cart';
  static schema = require('./schema');
  static include = [
    {
      model: User,
      as: 'user',
    },
    {
      model: CartItem,
      as: 'cartItem',
    },
  ];
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', allowNull: false });
    this.hasMany(models.CartItem, { foreignKey: 'cartId', allowNull: false });
  }
};
