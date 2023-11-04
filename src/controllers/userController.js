import { USER_STATUS, EMAIL_CONSTANTS, COMMON_CONSTANTS } from '../data/constant';
import { uploadImage } from '../helper/uploadFile';
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'dj6sdj5yq',
  api_key: '371489392313257',
  api_secret: 'fQRiqtcdpqtpED26cMR3eOdxi8c',
});
const logger = require('../utils/logger');
import {
  createUser,
  updateUser,
  login,
  verifyUser,
  disableUser,
  getListDisableUser,
  resetPassword,
  changePassword,
  getListUser,
  getCurrentUser,
  uploadAvatar,
  getAccessToken,
  requestChangeUserRole,
  approveChangeRoleRequest,
  sendFriendRequest,
  getFriendRequest,
  approveFriendRequest,
  rejectFriendRequest,
  getUserById,
} from '../services/userServices';
const config = require('../config');
import {
  UserSchema,
  UserUpdateSchema,
  Loginschema,
  changePasswordSchema,
  AvatarUpdateSchema,
  refreshTokenSchema,
  changeUserRoleSchema,
} from '../validators/userValidate';
const nodemailer = require('nodemailer');
const httpStatus = require('http-status');
import { verrifyEmailOption, resetPasswordOption } from '../helper/mailer';
const {
  Common,
  Success,
  CreatedSuccess,
  DeletedSuccess,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  ValidateFailed,
  WrongUsernameOrpassWord,
  ApiPaginatedResponse,
} = require('../helper/apiResponse');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});
const uploadFileController = async (req, res, next) => {
  try {
    const { error, value } = AvatarUpdateSchema.validate({ file: req.file });
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    const file = value.file;
    const userId = req.user.userId;
    uploadImage(file)
      .then((imageUrl) => {
        logger.info('Image uploaded successfully:', imageUrl);
        uploadAvatar(imageUrl, userId);
        return res.status(httpStatus.OK).json(new Success());
      })
      .catch((error) => {
        console.error('Error uploading image:', error.message);
        return res.status(httpStatus.BAD_REQUEST).json(new BadRequest());
      });
  } catch (err) {
    next(err);
  }
};

const createUserController = async (req, res, next) => {
  try {
    const { error, value } = UserSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    const host = req.headers.host;
    const user = await createUser(host, value);
    if (user == USER_STATUS.USER_EXIST) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.USER_EXIST));
    } else if (user == USER_STATUS.EMAIL_EXIST) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.EMAIL_EXIST));
    }

    const link = 'http://' + host + '/api/users/auth/register/verify/' + user.id;
    console.log('this is link', link);
    const { ...option } = new verrifyEmailOption(user.email, 'verify link', link);

    transporter.sendMail(option);
    return res.status(httpStatus.OK).json(new Success(EMAIL_CONSTANTS.EMAIL_CONFIRMATION));
  } catch (err) {
    next(err);
  }
};
const updateUserController = async (req, res, next) => {
  try {
    const { error, value } = UserUpdateSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    const userId = req.user.userId;
    const user = await updateUser(userId, value);
    if (user == USER_STATUS.USER_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.USER_NOTFOUND));
    }
    return res.status(httpStatus.OK).json(new Success(USER_STATUS.USER_UPDATE, user));
  } catch (err) {
    next(err);
  }
};
const loginController = async (req, res, next) => {
  try {
    const { error, value } = Loginschema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    const token = await login(value);
    if (token == null) {
      return res.status(httpStatus.UNAUTHORIZED).json(new WrongUsernameOrpassWord());
    }

    return res.status(httpStatus.OK).json(new Success('', token));
  } catch (err) {
    next(err);
  }
};
const verifyUserController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const verify = await verifyUser(id);
    if (verify) {
      return res.redirect('http://localhost:3000/verify-success');
      return res.status(httpStatus.OK).json(new Success('your account has been verified'));
    }
    return res.redirect('http://localhost:3000/verify-fail');
    return res.status(httpStatus.BadRequest).json(new BadRequest('email is not verified'));
  } catch (err) {
    next(err);
  }
};
const disableUserController = async (req, res, next) => {
  try {
    const uId = req.params.id;
    const currentUser = req.user.userId;
    const user = await disableUser(uId, currentUser);
    if (user == null || user == USER_STATUS.USER_DELETE_FAILED) {
      return res.status(400).json(new BadRequest(USER_STATUS.USER_DELETE_FAILED));
    }
    return res.status(httpStatus.OK).json(new Success(USER_STATUS.USER_DELETE));
  } catch (err) {
    next(err);
  }
};
const resetPasswordController = async (req, res, next) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const newPassword = await resetPassword(email, username);
    if (newPassword) {
      const { ...option } = new resetPasswordOption(email, 'new password', newPassword);
      transporter.sendMail(option, function (err) {
        if (err) {
          return res
            .status(httpStatus.BAD_REQUEST)
            .json(new BadRequest(EMAIL_CONSTANTS.EMAIL_ERROR));
        }
        return res.status(httpStatus.OK).json(new Success('Check Your email for new password'));
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Account not found'));
    }
  } catch (err) {
    next(err);
  }
};
const changePasswordController = async (req, res, next) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    } else if (value.newPassword == value.confirmPassword) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest('New password and confirm password must be different'));
    }
    const currentUserId = req.user.userId;
    const password = await changePassword(currentUserId, value);
    if (password == true) {
      return res.status(httpStatus.OK).json(new Success('Password changed'));
    }
    return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Password does not match'));
  } catch (err) {
    next(err);
  }
};
const getListUserController = async (req, res, next) => {
  try {
    let pageIndex = parseInt(req.query.pageIndex);
    let pageSize = parseInt(req.query.pageSize);
    if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
      pageIndex = config.defaultIndexPagination;
      pageSize = config.defaultSizePagination;
    }
    const result = await getListUser(pageIndex, pageSize);
    if (result == USER_STATUS.USER_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.USER_NOTFOUND));
    } else if (result == COMMON_CONSTANTS.INVALID_PAGE) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(COMMON_CONSTANTS.INVALID_PAGE));
    }
    return res
      .status(httpStatus.OK)
      .json(
        new ApiPaginatedResponse(
          result.status,
          result.pageIndex,
          result.pageSize,
          result.totalCount,
          result.totalPages,
          result.users,
        ),
      );
  } catch (error) {
    next(error);
  }
};
const getListDisableUserController = async (req, res, next) => {
  try {
    let pageIndex = parseInt(req.query.pageIndex);
    let pageSize = parseInt(req.query.pageSize);
    if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
      pageIndex = config.defaultIndexPagination;
      pageSize = config.defaultSizePagination;
    }
    const result = await getListDisableUser(pageIndex, pageSize);
    if (result == USER_STATUS.USER_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.USER_NOTFOUND));
    } else if (result == COMMON_CONSTANTS.INVALID_PAGE) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(COMMON_CONSTANTS.INVALID_PAGE));
    }
    return res
      .status(httpStatus.OK)
      .json(
        new ApiPaginatedResponse(
          result.status,
          result.pageIndex,
          result.pageSize,
          result.totalCount,
          result.totalPages,
          result.users,
        ),
      );
  } catch (error) {
    next(error);
  }
};
const getCurrentUserController = async (req, res, next) => {
  try {
    const id = req.user.userId;
    const user = await getCurrentUser(id);
    if (user) {
      return res.status(httpStatus.OK).json(new Success(USER_STATUS.USER_FOUND, user));
    }
    return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.USER_NOTFOUND));
  } catch (err) {
    next(err);
  }
};
const getAccessTokenController = async (req, res, next) => {
  try {
    const { error, value } = refreshTokenSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }

    const result = await getAccessToken(value.refreshToken);

    if (result.error === 'TokenExpiredError') {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Token expired'));
    } else if (result.error === 'JsonWebTokenError') {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Invalid token'));
    } else if (result.error === 'InternalError') {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Internal server error'));
    }

    const { accessToken, newRefreshToken } = result;
    return res.status(httpStatus.OK).json(new Success('', { accessToken, newRefreshToken }));
  } catch (err) {
    next(err);
  }
};
const requestChangeUserRoleController = async (req, res, next) => {
  try {
    const { error, value } = changeUserRoleSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    const curentUserId = req.user.userId;
    const roleId = value.roleId;
    const introduction = value.introduction;
    const result = await requestChangeUserRole(curentUserId, roleId, introduction);
    if (result == USER_STATUS.ROLE_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.ROLE_NOTFOUND));
    } else if (result == USER_STATUS.USER_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.USER_NOTFOUND));
    } else if (result == USER_STATUS.USER_ROLE_EXIST) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.USER_ROLE_EXIST));
    } else if (result == USER_STATUS.USER_REQUEST_ROLE_EXIST) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(USER_STATUS.USER_REQUEST_ROLE_EXIST));
    } else if (result == USER_STATUS.REQUEST_CHANGE_ROLE_FAIL) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(USER_STATUS.REQUEST_CHANGE_ROLE_FAIL));
    }
    return res.status(httpStatus.OK).json(new Success(USER_STATUS.REQUEST_CHANGE_ROLE, result));
  } catch (err) {
    next(err);
  }
};
const approveChangeRoleRequestController = async (req, res, next) => {
  try {
    const curentUserId = req.user.userId;
    const requestId = req.params.id;
    const result = await approveChangeRoleRequest(curentUserId, requestId);
    if (result == USER_STATUS.USER_ROLE_REQUEST_NOTFOUND) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(USER_STATUS.USER_ROLE_REQUEST_NOTFOUND));
    } else if (result == USER_STATUS.UPDATE_ROLE_FAIL) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.UPDATE_ROLE_FAIL));
    } else if (result == USER_STATUS.USER_REQUEST_ROLE_EXIST) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(USER_STATUS.USER_REQUEST_ROLE_EXIST));
    } else if (result == USER_STATUS.USER_ROLE_EXIST) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.USER_ROLE_EXIST));
    }
    return res.status(httpStatus.OK).json(new Success(USER_STATUS.UPDATE_ROLE_SUCCESS));
  } catch (err) {
    next(err);
  }
};
const sendFriendRequestController = async (req, res, next) => {
  try {
    const curentUserId = req.user.userId;
    const receiverId = req.params.id;
    if (curentUserId == receiverId) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(COMMON_CONSTANTS.SEND_REQUEST_TO_YOURSELF));
    }
    const result = await sendFriendRequest(curentUserId, receiverId);
    if (result == USER_STATUS.FRIEND_REQUEST_EXIST) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(USER_STATUS.FRIEND_REQUEST_EXIST));
    } else if (result == USER_STATUS.USER_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.USER_NOTFOUND));
    }
    return res.status(httpStatus.OK).json(new Success(COMMON_CONSTANTS.SUCCESS, result));
  } catch (err) {
    next(err);
  }
};
const getFriendRequestController = async (req, res, next) => {
  const curentUserId = req.user.userId;
  const result = await getFriendRequest(curentUserId);
  if (result == USER_STATUS.FRIEND_REQUEST_DOES_NOT_EXIST) {
    return res.status(httpStatus.OK).json(new Success(USER_STATUS.FRIEND_REQUEST_DOES_NOT_EXIST));
  }
  return res.status(httpStatus.OK).json(new Success(COMMON_CONSTANTS.SUCCESS, result));
};
const approveFriendRequestController = async (req, res, next) => {
  const curentUserId = req.user.userId;
  const requestId = req.params.id;
  const result = await approveFriendRequest(requestId);
  if (result == COMMON_CONSTANTS.NOT_FOUND) {
    return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(COMMON_CONSTANTS.NOT_FOUND));
  }
  return res.status(httpStatus.OK).json(new Success(COMMON_CONSTANTS.APPROVED, result));
};
const rejectFriendRequestController = async (req, res, next) => {
  const curentUserId = req.user.userId;
  const requestId = req.params.id;
  const result = await rejectFriendRequest(curentUserId, requestId);
  if (result == COMMON_CONSTANTS.NOT_FOUND) {
    return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(COMMON_CONSTANTS.NOT_FOUND));
  }
  return res.status(httpStatus.OK).json(new Success(COMMON_CONSTANTS.REJECTED, result));
};
const getUserByIdController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    if (user) {
      return res.status(httpStatus.OK).json(new Success(USER_STATUS.USER_FOUND, user));
    }
    return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.USER_NOTFOUND));
  } catch (err) {
    next(err);
  }
};
export {
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
};
