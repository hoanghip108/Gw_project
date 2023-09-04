const Transactionhistory = require('../database/models/transactionHistory');
const User = require('../database/models/user');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const createTransaction = async (orderId, userId, username, amount) => {
  const result = await Transactionhistory.create({
    transactionCode: orderId,
    userId: userId,
    createdBy: username,
    amount: amount,
  });
  if (result) {
    return result;
  }
  return null;
};
const vnpay_return_service = async (vnp_TxnRef) => {
  const query = `select * from transactionhistory where transactionCode = "${vnp_TxnRef}"`;
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return err;
      //   return res.render("success", { code: "97" });
    }
    if (result.length === 0) {
      return result;
      //   return res.render("success", { code: "00" });
    }
    // res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  });
};
const getOderService = async (orderId, userId) => {
  const order = await Transactionhistory.findOne({
    where: { [Op.and]: [{ transactionCode: orderId }, { userId: userId }] },
  });
  if (order) return order;
  return null;
};
const updateEcoin = async (userId, amount) => {
  const user = await User.findOne({ where: { id: userId } });
  if (user) {
    user.eCoin = user.eCoin + amount;
    await user.save();
    return user;
  }
  return null;
};
module.exports = { createTransaction, vnpay_return_service, getOderService, updateEcoin };
