// import open from 'open';
const moment = require('moment');
const { sortObject } = require('../helper/sortObject.js');
const {
  createTransaction,
  vnpay_return_service,
  getOderService,
  updateEcoin,
} = require('../services/paymentServices.js');
const create_payment = async (req, res, next) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  let tmnCode = process.env.VNP_TMNCODE;
  let secretKey = process.env.VNP_HASHSECRET;
  let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  let returnUrl = process.env.VNP_RETURN_URL;
  let orderId = moment(date).format('DDHHmmss');
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;

  let locale = req.body.language;
  if (locale === null || locale === '') {
    locale = 'vn';
  }
  let currCode = 'VND';
  let vnp_Params = {};
  let username = req.user.username;
  let userId = req.user.userId;
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho tai khoan:' + username;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  // vnp_Params['vnp_userId'] = userId;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }
  createTransaction(orderId, userId, username, amount);
  vnp_Params = sortObject(vnp_Params);
  console.log(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  console.log(vnpUrl);
  res.redirect(vnpUrl);
};
const vnpay_return = async (req, res, next) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  console.log(vnp_Params);
  let tmnCode = process.env.VNP_TMNCODE;
  let secretKey = process.env.VNP_HASHSECRET;

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    const result = vnpay_return_service(vnp_Params['vnp_TxnRef']);
    if (result) {
      console.log(result);
      return res.render('success', { code: '00' });
    } else return res.render('success', { code: '97' });
  } else {
    res.render('success', { code: '97' });
  }
};
const vnpay_ipn = async (req, res, next) => {
  console.log('connected to vnpay_IPN');
  let vnp_Params = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];

  let orderId = vnp_Params['vnp_TxnRef'];
  let rspCode = vnp_Params['vnp_ResponseCode'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  let secretKey = process.env.VNP_HASHSECRET;
  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
  // let userId = req.user.userId;
  let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  const order = await getOderService(orderId); // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = order.amount == vnp_Params['vnp_Amount'] / 100; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) {
    //kiểm tra checksum
    if (order) {
      if (checkAmount) {
        if (paymentStatus == '0') {
          //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode == '00') {
            //thanh cong
            //paymentStatus = '1'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            await order.update({ status: '1' });
            await order.save();
            console.log('Order updated to success');
            res.status(200).json({ RspCode: '00', Message: 'Success' });
          } else {
            //that bai
            //paymentStatus = '2'
            await order.update({ status: '2' });
            await order.save();
            console.log('Order updated to fail');
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            res.redirect(`/updateEcoin?userId=${order.userId}&orderId=${order.id}`);
          }
        } else {
          res.status(200).json({
            RspCode: '02',
            Message: 'This order has been updated to the payment status',
          });
        }
      } else {
        res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
      }
    } else {
      res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    }
  } else {
    res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
  }
};
const updateEcoinController = async (req, res, next) => {
  const userId = req.user.userId;
  const orderId = req.params.orderId;

  const result = await updateEcoin(userId, orderId);
  if (result) {
    res.status(200).json({ message: 'Update ecoin successfully' });
  } else {
    res.status(400).json({ message: 'Update ecoin failed' });
  }
};
module.exports = { create_payment, vnpay_return, vnpay_ipn, updateEcoinController };
