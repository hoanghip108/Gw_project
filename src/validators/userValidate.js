import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_REGEX,
  NAME_REGEX,
  TIME_REGEX,
  TIME_WITH_SECOND_REGEX,
  PHONE_NUMBER_REGEX,
} from "../utils/regex";
import Joi from "joi";
const Loginschema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().pattern(USERNAME_REGEX),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
const UserSchema = Joi.object({
  username: Joi.string()
    //.alphanum()
    .min(3)
    .max(30)
    .required()
    .pattern(USERNAME_REGEX),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  firstName: Joi.string().min(3).max(30),
  lastName: Joi.string().min(3).max(30),
  email: Joi.string().min(10).pattern(EMAIL_REGEX).required(),
  //managerId: Joi.string().required(),
  phone: Joi.string().min(10).max(11),
  avatar: Joi.string(),
  address: Joi.string().max(100),
  ///RoleId: Joi.number().required(),
});
const UserUpdateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).pattern(USERNAME_REGEX),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  firstName: Joi.string().min(3).max(30),
  lastName: Joi.string().min(3).max(30),
  email: Joi.string().min(10).pattern(EMAIL_REGEX),
  phone: Joi.string().min(10).max(11),
  avatar: Joi.string(),
  address: Joi.string().max(100),
});
export { Loginschema, UserSchema, UserUpdateSchema };
