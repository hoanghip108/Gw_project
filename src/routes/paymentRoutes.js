const express = require('express');
const paymentRouter = express.Router();
const {
  create_payment,
  vnpay_return,
  vnpay_ipn,
  byCourseController,
} = require('../controllers/paymentController.js');
import { verifyToken, authorize } from '../middleware/auth.js';
paymentRouter.post('/createPayment', verifyToken, create_payment);
paymentRouter.get('/vnpay_ipn', vnpay_ipn);
paymentRouter.get('/vnpay_return', vnpay_return);
paymentRouter.post('/buy-courses', verifyToken, byCourseController);
module.exports = paymentRouter;
