const User = require('../database/models/user');
const Role = require('../database/models/role');
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import randomString from '../data/randomString';
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
import {
  FORM_CATEGORY,
  FORM_STATUS,
  USER_FORM_STATUS,
  FORM_MESSAGE,
  USER_STATUS,
} from '../data/constant';
const login = async (payload) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.and]: [{ username: payload.username }, { isActive: true }],
      },
      include: [
        {
          model: Role,
          attributes: ['roleId'],
        },
      ],
    });
    console.log(user);
    if (user) {
      if (bcrypt.compareSync(payload.password, user.password)) {
        const dataForAccessToken = {
          userId: user.id,
          username: user.username,
          userRole: user.role.roleId,
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
        createdBy: 'A',
        isActive: false,
        roleRoleId: payload.RoleId,
      },
      transaction: t,
    });
    newUser.setDataValue('password', undefined);
    await t.commit();
    if (created) {
      return newUser;
    }
    return null;
  } catch (err) {
    console.log(err);
    transaction.rollback();
    next(err);
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
  const user = await User.findOne({ where: { [Op.and]: [{ id: id }, { isActive: true }] } });
  if (user) {
    user.isActive = false;
    await user.save();
    return user;
  }
  return null;
};
const resetPassword = async (email, username) => {
  const user = await User.findOne({
    where: { [Op.and]: [{ email: email }, { username: username }] },
  });
  if (user) {
    const rand = randomString(10);
    const salt = bcrypt.genSaltSync(Number(process.env.SALTROUNDS));
    const hash = bcrypt.hashSync(rand, salt);
    user.password = hash;
    await user.save();
    return rand;
  }
  return null;
};
export { createUser, login, verifyUser, disableUser, resetPassword };
