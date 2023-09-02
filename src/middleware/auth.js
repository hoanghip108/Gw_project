import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { USER_STATUS } from '../data/constant';
const { sequelize } = require('../config/database');
const Permission = require('../database/models/permission');
const Role = require('../database/models/role');
const apiResponse = require('../helper/apiResponse');
const APIError = require('../helper/apiError');
const getToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.length > 0) {
    return req.headers.authorization.split(/\s+/)[1];
  }
};

const verifyToken = (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json(
      new APIError({
        message: USER_STATUS.AUTHENTICATION_FAIL,
        errors: USER_STATUS.AUTHENTICATION_FAIL,
        status: httpStatus.UNAUTHORIZED,
      }),
    );
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const apiError = new APIError({
        message: USER_STATUS.AUTHENTICATION_FAIL,
        errors: USER_STATUS.AUTHENTICATION_FAIL,
        status: httpStatus.FORBIDDEN,
      });
      return res.status(httpStatus.FORBIDDEN).json(apiError);
    }
    req.user = user;
    next();
  });
};
const authorize = async (req, res, next) => {
  const { user } = req;
  if (!user) {
    return res.status(401).json(USER_STATUS.UNAUTHENTICATED);
  }
  const path = req._parsedUrl.path;
  var api;
  if (path.lastIndexOf('/') != 0) {
    api = path.substring(0, path.lastIndexOf('/'));
  } else {
    api = path.substring(0, path.lastIndexOf('?'));
  }
  const permission = await sequelize.query(
    `
    SELECT rp.method 
    FROM user_role AS ur
    JOIN role_permission AS rp ON ur.roleId = rp.roleId 
    JOIN user ON ur.userId = user.id
    JOIN permission AS perm ON rp.permissionId = perm.permissionId
    WHERE user.id = '${req.user.userId}'
    AND perm.api = '${api}';
    `,
  );
  let isPass = false;
  if (permission[0].length != 0) {
    const permissionArray = permission[0][0].method.split(',');
    permissionArray.forEach((method) => {
      if (req.method == method) {
        isPass = true;
        return isPass;
      }
    });
  }
  if (isPass) return next();
  const apiError = new APIError({
    message: USER_STATUS.PERMISSION,
    errors: USER_STATUS.PERMISSION,
    status: httpStatus.FORBIDDEN,
  });
  return res.status(httpStatus.FORBIDDEN).json(apiError);
};
export { verifyToken, authorize };
