const express = require('express');
import {
  createUserController,
  loginController,
  verifyUserController,
  disableUserController,
  resetPasswordController,
  changePasswordController,
  getListUserController,
} from '../controllers/userController';
import { verifyToken, authorize } from '../middleware/auth.js';
const userRouter = express.Router();
userRouter.get('/users/auth/register/verify/:id', verifyUserController);
userRouter.get('/users/forgotpassword', resetPasswordController);
userRouter.get('/users', verifyToken, authorize, getListUserController);
userRouter.post('/users/auth/login', loginController);
userRouter.post('/users/auth/register', createUserController);
userRouter.delete('/users/disable/:id', verifyToken, authorize, disableUserController);
userRouter.put('/users/changepassword', verifyToken, changePasswordController);
export default userRouter;
