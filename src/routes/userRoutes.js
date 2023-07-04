const express = require('express');
import {
  createUserController,
  loginController,
  verifyUserController,
  disableUserController,
  resetPasswordController,
} from '../controllers/userController';
import { verifyToken, authorize } from '../middleware/auth.js';
const userRouter = express.Router();
userRouter.post('/users/auth/login', loginController);
userRouter.post('/users/auth/register', createUserController);
userRouter.get('/users/auth/register/verify/:id', verifyUserController);
userRouter.get('/users/disable/:id', verifyToken, disableUserController);
userRouter.get('/users/forgotpassword', resetPasswordController);
export default userRouter;
