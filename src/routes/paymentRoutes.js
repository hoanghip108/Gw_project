const express = require('express');
const paymentRouter = express.Router();
import {
  createPaymentController,
  getPaymentResultController,
  getPaymentInforController,
} from '../controllers/paymentController';
paymentRouter.post('/createPayment', createPaymentController);
paymentRouter.get('/vnpay_ipn', getPaymentResultController);
paymentRouter.get('/vnpay_return', getPaymentInforController);
module.exports = paymentRouter;
