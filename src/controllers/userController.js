import { createUser, login, verifyUser } from "../services/userServices";
import { UserSchema, Loginschema } from "../validators/userValidate";
const httpStatus = require("http-status");
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
} = require("../helper/apiResponse");
const createUserController = async (req, res, next) => {
  try {
    const { error, value } = UserSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const host = req.headers.host;
    const user = await createUser(host, value);
    if (!user) {
      return res.status(httpStatus.CONFLICT).json(new Conflict());
    }
    res.status(httpStatus.OK);
    res.json(new Success("Data updated successfully.", user));
  } catch (err) {
    next(err);
  }
};
const loginController = async (req, res, next) => {
  try {
    const { error, value } = Loginschema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const token = await login(value);
    if (token == null) {
      res.status(httpStatus.UNAUTHORIZED).json(new WrongUsernameOrpassWord());
    }
    res.status(httpStatus.OK).json(new Success("", token));
  } catch (err) {
    next(err);
  }
};
const verifyUserController = async (req, res, next) => {
  try {
    const protocol = req.protocol;
    const host = req.get("host");
    const id = req.params.id;
    const verify = await verifyUser(id);
    if (verify) {
      return res
        .status(httpStatus.OK)
        .json(new Success("your account has been verified"));
    }
    return res
      .status(httpStatus.BadRequest)
      .json(new BadRequest("email is not verified"));
  } catch (err) {
    next(err);
  }
};
export { createUserController, loginController, verifyUserController };
