import jwt from 'jsonwebtoken';
const permissions = require('../database/models/permission');
import httpStatus from 'http-status';
import { USER_STATUS } from '../data/constant';
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
    const apiError = new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'unauthenticated',
    });
    return res.status(httpStatus.UNAUTHORIZED).json(apiError);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const apiError = new APIError({
        status: httpStatus.FORBIDDEN,
        message: USER_STATUS.AUTHENTICATION_FAIL,
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
  console.log('this is api: ' + api);
  const { method } = req;
  let isPass = false;
  let Role = user.userRole;
  const permission = await permissions.findOne({ where: { api, Role } });
  if (permission) {
    switch (method) {
      case 'GET':
        if (permission.read) isPass = true;
        console.log(permission.read);
        break;
      case 'POST':
        if (permission.write) isPass = true;
        break;
      case 'PUT':
        if (permission.updatee) isPass = true;
        break;
      case 'DELETE':
        if (permission.delete) isPass = true;
        break;
      case 'PATCH':
        if (permission.approve) isPass = true;
        break;
    }
    if (isPass) return next();
  }

  return next(new APIError({ message: USER_STATUS.PERMISSION, status: httpStatus.FORBIDDEN }));
};
export { verifyToken, authorize };
