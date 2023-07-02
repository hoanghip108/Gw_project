const User = require('../database/models/user');
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
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
    const user = await User.findOne({ where: { username: payload.username } });
    if (user) {
      if (bcrypt.compareSync(payload.password, user.password)) {
        const dataForAccessToken = {
          userId: user.id,
          username: user.username,
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
var newUserId;
const createUser = async (host, payload) => {
  let t;
  try {
    t = await sequelize.transaction();
    const salt = bcrypt.genSaltSync(Number(process.env.SALTROUNDS));
    const hash = bcrypt.hashSync(payload.password, salt);
    const [newUser, created] = await User.findOrCreate({
      where: { [Op.or]: [{ username: payload.username }, { email: payload.email }] },
      defaults: { ...payload, password: hash, createdBy: 'A', isActive: false },
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
  console.log('id value: ' + id);
  const user = await User.findOne({ where: { id: id } });
  if (user) {
    user.isActive = true;
    await user.save();
    return user;
  } else {
    return null;
  }
};
export { createUser, login, verifyUser };
