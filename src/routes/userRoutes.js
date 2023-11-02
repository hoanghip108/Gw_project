const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import {
  createUserController,
  updateUserController,
  loginController,
  verifyUserController,
  disableUserController,
  getListDisableUserController,
  resetPasswordController,
  changePasswordController,
  getListUserController,
  getCurrentUserController,
  uploadFileController,
  getAccessTokenController,
  requestChangeUserRoleController,
  approveChangeRoleRequestController,
  getFriendRequestController,
  sendFriendRequestController,
  approveFriendRequestController,
  rejectFriendRequestController,
  getUserByIdController,
} from '../controllers/userController';
import { authorize, verifyToken } from '../middleware/auth.js';
const userRouter = express.Router();
userRouter.get('/users/auth/register/verify/:id', verifyUserController);
userRouter.get('/users/profile', verifyToken, getCurrentUserController);
userRouter.get('/users/disable', verifyToken, authorize, getListDisableUserController);
userRouter.get('/users/:id', verifyToken, getUserByIdController);
userRouter.get('/users', verifyToken, getListUserController);
userRouter.post('/users/forgotpassword', resetPasswordController);
userRouter.post('/users/auth/login', loginController);
userRouter.post('/users/auth/refreshToken', getAccessTokenController);
userRouter.post('/users/auth/register', createUserController);
userRouter.put('/users/changepassword', verifyToken, changePasswordController);
userRouter.delete('/users/disable/:id', verifyToken, authorize, disableUserController);
userRouter.patch('/users/uploadAvatar', verifyToken, upload.single('file'), uploadFileController);
userRouter.patch('/users', verifyToken, updateUserController);
userRouter.patch(
  '/users/request-change-role/:id',
  verifyToken,
  authorize,
  approveChangeRoleRequestController,
);
userRouter.post('/users/request-change-role', verifyToken, requestChangeUserRoleController);
//Social network area ##################
userRouter.get('/users/friend-request', verifyToken, getFriendRequestController);
userRouter.post('/users/add-friend/:id', verifyToken, sendFriendRequestController);
userRouter.patch('/users/approve-friend/:id', verifyToken, approveFriendRequestController);
userRouter.patch('/users/reject-friend/:id', verifyToken, rejectFriendRequestController);
module.exports = userRouter;
