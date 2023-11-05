const CartItem = require('../database/models/cartItem');
const Cart = require('../database/models/cart');
const Course = require('../database/models/course');
const { Op } = require('sequelize');
const dataToExclude = [...Object.values(ExcludedData)];

const addToCart = async (payload) => {
  const result = await CartItem.create({ ...payload });
  if (result) {
    return result;
  }
};
