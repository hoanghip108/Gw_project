import { USER_STATUS, EMAIL_CONSTANTS, COMMON_CONSTANTS } from '../data/constant';
import { USER } from '../helper/messageResponse';
import { uploadImage } from '../helper/uploadFile';
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'dj6sdj5yq',
  api_key: '371489392313257',
  api_secret: 'fQRiqtcdpqtpED26cMR3eOdxi8c',
});
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
  changeUserRole,
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
        console.log('Image uploaded successfully:', imageUrl);
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
    if (!user) {
      return res.status(httpStatus.CONFLICT).json(new Conflict());
    }

    const link = 'http://' + host + '/api/users/auth/register/verify/' + user.id;
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
      return res.status(httpStatus.OK).json(new Success('your account has been verified'));
    }
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
    if (user == USER.Delete_yourself) {
      console.log(user);
      return res.status(400).json(new BadRequest(USER.Delete_yourself));
    } else if (user == null) {
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
      console.log('ok');
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
      console.log('ok');
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
    console.log({ accessToken, newRefreshToken });
    return res.status(httpStatus.OK).json(new Success('', { accessToken, newRefreshToken }));
  } catch (err) {
    next(err);
  }
};
const changeUserRoleController = async (req, res, next) => {
  try {
    const { error, value } = changeUserRoleSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    const curentUserId = req.user.userId;
    const userId = value.userId;
    const roleId = value.roleId;
    const result = await changeUserRole(userId, roleId, curentUserId);
    if (result == USER_STATUS.ROLE_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.ROLE_NOTFOUND));
    } else if (result == USER_STATUS.USER_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.USER_NOTFOUND));
    } else if (result == USER_STATUS.UPDATE_ROLE_FAIL) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(USER_STATUS.UPDATE_ROLE_FAIL));
    }
    return res.status(httpStatus.OK).json(new Success(USER_STATUS.UPDATE_ROLE_SUCCESS, result));
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
  changeUserRoleController,
};
