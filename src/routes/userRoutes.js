const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import {
  createUserController,
  loginController,
  verifyUserController,
  disableUserController,
  resetPasswordController,
  changePasswordController,
  getListUserController,
  getCurrentUserController,
  uploadFileController,
  getAccessTokenController,
} from '../controllers/userController';
import { verifyToken, authorize } from '../middleware/auth.js';
const userRouter = express.Router();
userRouter.get('/users/auth/register/verify/:id', verifyUserController);
userRouter.get('/users/profile', verifyToken, authorize, getCurrentUserController);
userRouter.get('/users', verifyToken, authorize, getListUserController);
userRouter.post('/users/forgotpassword', resetPasswordController);
userRouter.post('/users/auth/login', loginController);
userRouter.post('/users/auth/refreshToken', getAccessTokenController);
userRouter.post('/users/auth/register', createUserController);
userRouter.put('/users/changepassword', verifyToken, changePasswordController);
userRouter.delete('/users/disable/:id', verifyToken, authorize, disableUserController);
userRouter.patch('/users/uploadAvatar', verifyToken, upload.single('file'), uploadFileController);
module.exports = userRouter;
