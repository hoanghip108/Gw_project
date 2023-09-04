const Transactionhistory = require('../database/models/transactionHistory');
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
module.exports = { createTransaction, vnpay_return_service };
