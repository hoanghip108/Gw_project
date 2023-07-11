const User = require('../database/models/user');
const Role = require('../database/models/role');
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import randomString from '../data/randomString';
import getKeyByValue from '../helper/getKey';
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
} = require('../helper/apiResponse');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
import { ROLE, COMMON_CONSTANTS } from '../data/constant';
import {
  FORM_CATEGORY,
  FORM_STATUS,
  USER_FORM_STATUS,
  FORM_MESSAGE,
  USER_STATUS,
} from '../data/constant';
import { transform } from 'lodash';
const login = async (payload) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.and]: [{ username: payload.username }, { isActive: true }],
      },
      include: [
        {
          model: Role,
          attributes: ['RoleId'],
        },
      ],
    });
    if (user) {
      if (bcrypt.compareSync(payload.password, user.password)) {
        const dataForAccessToken = {
          userId: user.id,
          username: user.username,
          userRole: user.RoleId,
        };
        const token = jwt.sign(dataForAccessToken, process.env.JWT_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRATION,
        });
        return { user, token };
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
    const salt = bcrypt.genSaltSync(Number(process.env.SALTROUNDS));
    const hash = bcrypt.hashSync(payload.password, salt);
    const [newUser, created] = await User.findOrCreate({
      where: { [Op.or]: [{ username: payload.username }, { email: payload.email }] },
      defaults: {
        ...payload,
        password: hash,
        createdBy: payload.username,
        isActive: false,
        RoleId: ROLE['USER'],
      },
      transaction: t,
    });
    newUser.setDataValue('password', undefined);
    newUser.setDataValue('RoleId', undefined);
    await t.commit();
    if (created) {
      return newUser;
    }
    return null;
  } catch (err) {
    console.log(err);
    await t.rollback();
  }
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
const disableUser = async (id) => {
  let t;
  try {
    const user = await User.findOne({ where: { [Op.and]: [{ id: id }, { isActive: true }] } });
    if (user) {
      await user.update({ isActive: false }, { transaction: t });
      return user;
    }
    return null;
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};
const resetPassword = async (email, username) => {
  let t;
  try {
    t = await sequelize.transacion();
    const user = await User.findOne({
      where: { [Op.and]: [{ email: email }, { username: username }] },
    });
    if (user) {
      const rand = randomString(10);
      const salt = bcrypt.genSaltSync(Number(process.env.SALTROUNDS));
      const hash = bcrypt.hashSync(rand, salt);
      await user.update({ password: hash }, { transacion: t });
      return rand;
    }
    return null;
  } catch (err) {
    await t.rollback();
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
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    include: [Role],
  });

  const totalCount = users.length;
  if (!totalCount) {
    throw new APIError({ message: USER_STATUS.USER_NOTFOUND, status: httpStatus.NOT_FOUND });
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  if (pageIndex > totalPages) {
    throw new APIError({
      message: COMMON_CONSTANTS.INVALID_PAGE,
      status: httpStatus.BAD_REQUEST,
    });
  }

  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    users,
    startIndex,
    endIndex,
    //users.slice(startIndex, endIndex),
  };
};
export { createUser, login, verifyUser, disableUser, resetPassword, changePassword, getListUser };
