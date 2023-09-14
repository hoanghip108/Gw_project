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
  const result = await Transactionhistory.findOne({ where: { transactionCode: vnp_TxnRef } });
  if (result) {
    console.log(result);
    return result;
    // return res.render("success", { code: "00" });
  }
  return null;
  // res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
};

const getOderService = async (orderId) => {
  const order = await Transactionhistory.findOne({
    where: { transactionCode: orderId },
  });
  if (order) return order;
  return null;
};
const updateEcoin = async (userId, orderId) => {
  let t;
  try {
    const bill = await Transactionhistory.findOne({
      where: { [Op.and]: [{ userId: userId }, { transactionCode: orderId }, { isTranfer: false }] },
    });
    if (bill) {
      t = await sequelize.transaction();
      console.log(bill.amount);
      const user = await User.update(
        { eCoin: sequelize.literal(`ecoin + ${bill.amount}`) },
        { where: { id: userId } },
      );
      bill.update({ isTranfer: true });
      await t.commit();
      return user;
    }
    return null;
  } catch (err) {
    await t.rollback();
    console.log(err.message);
  }
};
module.exports = { createTransaction, vnpay_return_service, getOderService, updateEcoin };
