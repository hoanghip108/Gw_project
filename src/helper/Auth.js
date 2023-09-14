import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { api } from '../database/models/permission/schema';
const APIError = require('../helper/apiError');
const genAccessToken = (data) => {
  const acccessToken = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
  const refreshToken = jwt.sign(data, process.env.JWT_REFRESH, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
  return acccessToken;
};

const genRefreshToken = (data) => {
  const refreshToken = jwt.sign(data, process.env.JWT_REFRESH, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
  return refreshToken;
};
const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_REFRESH, (err, user) => {
      if (err) {
        reject(err); // Reject with the error
      } else {
        resolve(user); // Resolve with the user information
      }
    });
  });
};
export { genAccessToken, genRefreshToken, verifyRefreshToken };
