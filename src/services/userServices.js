const User = require('../database/models/user');
const Role = require('../database/models/role');
const User_role = require('../database/models/user_role');
const Cart = require('../database/models/cart');
const userRolePending = require('../database/models/userRolePending');
const friendShip = require('../database/models/friendShip');
const APIError = require('../helper/apiError');
import ExcludedData from '../helper/excludeData';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import randomString from '../data/randomString';
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
import { ROLE_DEFINE, COMMON_CONSTANTS } from '../data/constant';
import { genAccessToken, genRefreshToken, verifyRefreshToken } from '../helper/Auth';
import {
  FORM_CATEGORY,
  FORM_STATUS,
  USER_FORM_STATUS,
  FORM_MESSAGE,
  USER_STATUS,
} from '../data/constant';
import hashPassword from '../helper/hashPassword';
const cron = require('node-cron');
const dataToExclude = [...Object.values(ExcludedData)];
const login = async (payload) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.and]: [{ username: payload.username }, { isActive: true }],
      },
      attributes: { exclude: dataToExclude },
    });
    if (user) {
      if (bcrypt.compareSync(payload.password, user.password)) {
        console.log('this is userID: ', user.id);
        const user_role = await User_role.findOne({
          where: { userId: user.id },
        });
        const role = await Role.findOne({
          where: { roleId: user_role.roleId },
          attributes: { exclude: dataToExclude },
        });
        const data = {
          userId: user.id,
          username: user.username,
          roleId: role.roleId,
        };
        const accessToken = genAccessToken(data);
        const refreshToken = genRefreshToken(data);
        user.password = undefined;
        return { user, role, accessToken, refreshToken };
      }
    }
    return null;
  } catch (err) {
    throw new Error(err);
  }
};
cron.schedule('* * * * *', async () => {
  const now = Date.now();
  const users = await User.findAll({ where: { isActive: false } });
  console.log('running');
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const time = now - user.createdAt;
    console.log('this is now: ', now);
    console.log('this is createdAt: ', user.createdAt);
    console.log('this is time: ', time);
    if (time >= 60 * 1000) {
      // 1 minute (60 seconds * 1000 milliseconds)
      console.log(user.username + ' is deleted');
      await user.destroy();
    }
  }
});

const createUser = async (host, payload) => {
  let t;
  try {
    t = await sequelize.transaction();
    const hash = hashPassword(payload.password);
    let existUser = await User.findOne({
      where: { username: payload.username },
      attributes: ['username'],
    });
    if (existUser) {
      return USER_STATUS.USER_EXIST;
    }
    existUser = await User.findOne({ where: { email: payload.email }, attributes: ['email'] });
    if (existUser) {
      return USER_STATUS.EMAIL_EXIST;
    }
    const newUser = await User.create({
      ...payload,
      password: hash,
      createdBy: payload.username,
      isActive: false,
    });

    newUser.setDataValue('password', undefined);
    newUser.setDataValue('RoleId', undefined);
    if (newUser) {
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

    attributes: { exclude: dataToExclude },
  });
  if (user) {
    const user_role = await User_role.findOne({
      where: { userId: user.id },
    });
    const role = await Role.findOne({
      where: { roleId: user_role.roleId },
      attributes: { exclude: dataToExclude },
    });
    return { user, role };
  }
  return null;
};
const disableUser = async (uId, currentUserId) => {
  let t;
  try {
    const user = await User.findOne({
      where: { [Op.and]: [{ id: uId }, { isActive: true }] },
    });

    if (!user) {
      return null;
    }
    if (user.id != currentUserId) {
      await user.update({ isActive: false }, { transaction: t });
      await t.commit();
      return user;
    }
    return USER_STATUS.USER_DELETE_FAILED;
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
  const currentUser = await User.findOne({ where: { id: currentUserId } });
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
    {
      where: { isActive: true },
      attributes: ['id', 'username', 'email', 'bio', 'ecoin', 'avatar', 'createdAt', 'updatedAt'],
    },
    { offset, limit },
    {
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
//Social Area #############################################################
const getFriendRequest = async (userId) => {
  const requests = await friendShip.findAll({
    where: { receiverId: userId, status: COMMON_CONSTANTS.PENDING },
    attributes: ['id', 'senderId', 'receiverId', 'status', 'createdAt', 'createdBy'],
  });
  if (requests.length > 0) {
    return requests;
  }
  return USER_STATUS.FRIEND_REQUEST_DOES_NOT_EXIST;
};
const sendFriendRequest = async (senderId, receiverId) => {
  const receiver = await User.findOne({ where: { id: receiverId } });
  if (!receiver) {
    return USER_STATUS.USER_NOTFOUND;
  }
  const friend = await friendShip.findOne({
    where: { senderId: senderId, receiverId: receiverId, status: COMMON_CONSTANTS.APPROVED },
  });
  if (friend) {
    return USER_STATUS.FRIEND_EXIST;
  }
  const [newFriendShip, created] = await friendShip.findOrCreate({
    where: {
      senderId: senderId,
      receiverId: receiverId,
      [Op.or]: [{ status: COMMON_CONSTANTS.PENDING }, { status: COMMON_CONSTANTS.APPROVED }],
    },
    defaults: {
      senderId: senderId,
      receiverId: receiverId,
      status: COMMON_CONSTANTS.PENDING,
      createdAt: Date.now(),
      createdBy: senderId,
    },
  });
  if (created > 0) {
    return newFriendShip;
  }
  return USER_STATUS.FRIEND_REQUEST_EXIST;
};
const approveFriendRequest = async (requestId) => {
  const result = await friendShip.findOne({
    where: { id: requestId, status: COMMON_CONSTANTS.PENDING },
  });
  if (!result) {
    return COMMON_CONSTANTS.NOT_FOUND;
  }
  await result.update({ status: COMMON_CONSTANTS.APPROVED });
  return result;
};
const rejectFriendRequest = async (senderId, receiverId) => {
  const result = await friendShip.findOne({
    where: { senderId: senderId, receiverId: receiverId, status: COMMON_CONSTANTS.PENDING },
  });
  if (!friendShresultip) {
    return COMMON_CONSTANTS.NOT_FOUND;
  }
  await result.update({ status: COMMON_CONSTANTS.REJECTED });
  return result;
};
const getUserById = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    attributes: { exclude: dataToExclude },
  });
  if (user) {
    return user;
  }
  return null;
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
  getFriendRequest,
  sendFriendRequest,
  approveFriendRequest,
  rejectFriendRequest,
  getUserById,
};
