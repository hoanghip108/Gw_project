import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { USER_STATUS } from '../data/constant';
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
    const apiError = new APIError({
      message: USER_STATUS.AUTHENTICATION_FAIL,
      errors: USER_STATUS.AUTHENTICATION_FAIL,
      status: httpStatus.UNAUTHORIZED,
    });
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
  console.log('this is api: ' + api);
  const { method } = req;
  console.log('this is Method: ' + method);
  let isPass = false;
  let Role = user.userRole;
  console.log('this is Role: ' + Role);
  const permission = await Permission.findOne({
    where: { api, RoleId: Role },
  });
  if (permission) {
    switch (method) {
      case 'GET':
        if (permission.canRead) isPass = true;
        console.log(permission.read);
        break;
      case 'POST':
        if (permission.canCreate) isPass = true;
        break;
      case 'PUT':
        if (permission.canUpdate) isPass = true;
        break;
      case 'DELETE':
        if (permission.canDelete) isPass = true;
        console.log(permission.canDelete);
        break;
      case 'PATCH':
        if (permission.canPatch) isPass = true;
        break;
    }
    if (isPass) return next();
  }

  return next(new APIError({ message: USER_STATUS.PERMISSION, status: httpStatus.FORBIDDEN }));
};
export { verifyToken, authorize };
