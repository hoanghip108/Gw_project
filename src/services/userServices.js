const User = require('../database/models/user');
const Role = require('../database/models/role');
const User_role = require('../database/models/user_role');
const Cart = require('../database/models/cart');
const userRolePending = require('../database/models/userRolePending');
const APIError = require('../helper/apiError');
import ExcludedData from '../helper/excludeData';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import randomString from '../data/randomString';
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
import { ROLE_DEFINE, COMMON_CONSTANTS } from '../data/constant';
import { USER } from '../helper/messageResponse';
import { genAccessToken, genRefreshToken, verifyRefreshToken } from '../helper/Auth';
import {
  FORM_CATEGORY,
  FORM_STATUS,
  USER_FORM_STATUS,
  FORM_MESSAGE,
  USER_STATUS,
} from '../data/constant';
import hashPassword from '../helper/hashPassword';
const dataToExclude = [...Object.values(ExcludedData)];
const login = async (payload) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.and]: [{ username: payload.username }, { isActive: true }],
      },
      include: [
        {
          model: Role,
          attributes: { exclude: dataToExclude },
        },
      ],
      attributes: { exclude: dataToExclude },
    });
    if (user) {
      if (bcrypt.compareSync(payload.password, user.password)) {
        const data = {
          userId: user.id,
          username: user.username,
        };
        const accessToken = genAccessToken(data);
        const refreshToken = genRefreshToken(data);
        user.password = undefined;
        return { user, accessToken, refreshToken };
      }
    }
    return null;
  } catch (err) {
    throw new Error(err);
  }
};

const createUser = async (host, payload) => {
  let t;
  try {
    t = await sequelize.transaction();
    const hash = hashPassword(payload.password);
    const [newUser, created] = await User.findOrCreate({
      where: { [Op.or]: [{ username: payload.username }, { email: payload.email }] },
      defaults: {
        ...payload,
        password: hash,
        createdBy: payload.username,
        isActive: false,
      },
      transaction: t,
    });
    await t.commit();
    newUser.setDataValue('password', undefined);
    newUser.setDataValue('RoleId', undefined);
    if (created) {
      User_role.bulkCreate([
        {
          userId: newUser.id,
          roleId: ROLE_DEFINE.USER,
          createdBy: payload.username,
          isApproved: true,
        },
      ]);
      Cart.bulkCreate([
        {
          cartId: newUser.id,
          createdBy: payload.username,
          userId: newUser.id,
        },
      ]);
      return newUser;
    }
    return null;
  } catch (err) {
    console.log(err);
    await t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const updateUser = async (currentUserId, payload) => {
  const user = await User.findOne({
    where: { [Op.and]: [{ id: currentUserId }, { isActive: true }] },
  });
  if (!user) {
    return USER_STATUS.USER_NOTFOUND;
  }
  await user.update(payload, { updatedBy: currentUserId, updatedAt: Date.now() });
  const updatedUser = await User.findOne({
    where: { id: currentUserId },
    attributes: { exclude: dataToExclude.concat(['password']) },
  });
  return updatedUser;
};
const verifyUser = async (id) => {
  const user = await User.findOne({ where: { id: id } });
  if (user) {
    user.isActive = true;
    await user.save();
    return user;
  } else {
    return null;
  }
};
const getCurrentUser = async (id) => {
  const user = await User.findOne({
    where: { [Op.or]: [{ id: id }, { username: id }] },
    include: [{ model: Role, attributes: { exclude: dataToExclude } }],
    attributes: { exclude: dataToExclude },
  });
  if (user) {
    return user;
  }
  return null;
};
const disableUser = async (uId, currentUserId) => {
  let t;
  try {
    const user = await User.findOne({
      where: { [Op.and]: [{ id: uId }, { isActive: true }] },
    });
    console.log();
    if (!user) {
      return null;
    }
    if (user.id != currentUserId) {
      console.log(user.id != uId);
      await user.update({ isActive: false }, { transaction: t });
      return user;
    }
    await t.commit();
    return USER.Delete_yourself;
  } catch (err) {
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const resetPassword = async (email, username) => {
  let t;
  try {
    t = await sequelize.transaction();
    const user = await User.findOne({
      where: { [Op.and]: [{ email: email }, { username: username }] },
    });
    if (user) {
      const rand = randomString(10);
      const salt = bcrypt.genSaltSync(Number(process.env.SALTROUNDS));
      const hash = bcrypt.hashSync(rand, salt);
      await user.update({ password: hash }, { transacion: t });
      await t.commit();
      return rand;
    }
    return null;
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const changePassword = async (currentUserId, payload) => {
  const currentUser = await User.findOne({ currentUserId });
  if (bcrypt.compareSync(payload.oldPassword, currentUser.password)) {
    const salt = bcrypt.genSaltSync(Number(process.env.SALTROUNDS));
    const hash = bcrypt.hashSync(payload.newPassword, salt);
    (currentUser.password = hash), await currentUser.save();
    return true;
  }
  return false;
};
const getListUser = async (pageIndex, pageSize) => {
  const offset = (pageIndex - 1) * pageSize;
  const limit = pageSize;
  const users = await User.findAll(
    { offset, limit },
    {
      attributes: {
        exclude: [
          'password',
          'avatar',
          'isActive',
          'bio',
          'isDelete',
          'createdBy',
          'updatedBy',
          'updatedAt',
          'RoleId',
        ],
      },
      include: [{ model: Role, attributes: ['Rolename'] }],
    },
  );
  const totalCount = await User.count();
  if (!totalCount) {
    return USER_STATUS.USER_NOTFOUND;
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  if (pageIndex > totalPages) {
    return COMMON_CONSTANTS.INVALID_PAGE;
  }

  return {
    status: httpStatus.OK,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    users,
  };
};
const getListDisableUser = async (pageIndex, pageSize) => {
  const offset = (pageIndex - 1) * pageSize;
  const limit = pageSize;
  const users = await User.findAll(
    { where: { isActive: false } },
    { offset, limit },
    {
      attributes: {
        exclude: [
          'password',
          'avatar',
          'isActive',
          'bio',
          'isDelete',
          'createdBy',
          'updatedBy',
          'updatedAt',
          'RoleId',
        ],
      },
      include: [{ model: Role, attributes: ['Rolename'] }],
    },
  );
  const totalCount = await User.count();
  if (!totalCount) {
    return USER_STATUS.USER_NOTFOUND;
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  if (pageIndex > totalPages) {
    return COMMON_CONSTANTS.INVALID_PAGE;
  }

  return {
    status: httpStatus.OK,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    users,
  };
};
const uploadAvatar = async (filePath, userId) => {
  const user = await User.update({ avatar: filePath }, { where: { id: userId } });
  if (user) {
    return user;
  }
  return null;
};
const getAccessToken = async (refreshToken) => {
  try {
    const { userId, username } = await verifyRefreshToken(refreshToken);
    const accessToken = genAccessToken({ userId, username });
    const newRefreshToken = genRefreshToken({ userId, username });

    return { accessToken, newRefreshToken };
  } catch (err) {
    // Handle different types of errors
    if (err.name === 'TokenExpiredError') {
      return { error: 'TokenExpiredError' };
    } else if (err.name === 'JsonWebTokenError') {
      return { error: 'JsonWebTokenError' };
    } else {
      return { error: 'InternalError' }; // Handle other unexpected errors
    }
  }
};
const requestChangeUserRole = async (userId, roleId) => {
  const role = await Role.findOne({ where: { roleId: roleId } });
  if (!role) {
    return USER_STATUS.ROLE_NOTFOUND;
  }
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return USER_STATUS.USER_NOTFOUND;
  }
  const userRole = await User_role.findOne({
    where: { userId: userId, roleId: roleId },
  });
  if (userRole) {
    return USER_STATUS.USER_ROLE_EXIST;
  }
  const requestPending = await userRolePending.findOne({
    where: { userId: userId, roleId: roleId, isDeleted: false },
  });
  if (requestPending) {
    return USER_STATUS.USER_REQUEST_ROLE_EXIST;
  }
  const request = await userRolePending.create({
    userId: userId,
    roleId: roleId,
    createdBy: userId,
    createdAt: Date.now(),
  });

  if (request) {
    return request;
  }
  return USER_STATUS.REQUEST_CHANGE_ROLE_FAIL;
};
const approveChangeRoleRequest = async (curentUserId, requestId) => {
  const request = await userRolePending.findOne({
    where: { id: requestId, isDeleted: false },
  });
  if (!request) {
    return USER_STATUS.USER_ROLE_REQUEST_NOTFOUND;
  }
  const user = await User.findOne({ where: { id: request.userId } });
  if (!user) {
    return USER_STATUS.USER_NOTFOUND;
  }
  const role = await Role.findOne({ where: { roleId: request.roleId } });
  if (!role) {
    return USER_STATUS.ROLE_NOTFOUND;
  }
  const userRole = await User_role.findOne({
    where: { userId: user.id, roleId: role.roleId },
  });
  if (userRole) {
    await userRole.update({ isApproved: true });
    await request.update({ isDeleted: true });
    return USER_STATUS.UPDATE_ROLE_SUCCESS;
  }
  await User_role.create({
    userId: user.id,
    roleId: role.roleId,
    createdBy: curentUserId,
    createdAt: Date.now(),
    isApproved: true,
  });
  await request.update({ isDeleted: true });
  return USER_STATUS.UPDATE_ROLE_SUCCESS;
};
export {
  getCurrentUser,
  createUser,
  updateUser,
  login,
  verifyUser,
  disableUser,
  getListDisableUser,
  resetPassword,
  changePassword,
  getListUser,
  uploadAvatar,
  getAccessToken,
  requestChangeUserRole,
  approveChangeRoleRequest,
};
