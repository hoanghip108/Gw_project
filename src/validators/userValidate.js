import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_REGEX,
  NAME_REGEX,
  TIME_REGEX,
  TIME_WITH_SECOND_REGEX,
  PHONE_NUMBER_REGEX,
} from '../utils/regex';
import Joi from 'joi';
const Loginschema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().pattern(USERNAME_REGEX),

  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});
const UserSchema = Joi.object({
  username: Joi.string()
    //.alphanum()
    .min(8)
    .max(15)
    .required()
    .regex(USERNAME_REGEX)
    .messages({
      'string.min': 'username must be at least 8 characters long',
      'string.max': 'username must have maximum 15 characters',
      'string.required': 'username is required',
      'string.pattern.base': 'username must not have special characters',
    }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  firstName: Joi.string().min(3).max(30),
  lastName: Joi.string().min(3).max(30),
  email: Joi.string().min(10).max(30).regex(EMAIL_REGEX).required().messages({
    'string.min': 'Email must have at least 10 characters',
    'string.max': 'Email must have maximum 30 characters',
    'string.pattern.base': 'Email must have @ characters',
  }),
  //managerId: Joi.string().required(),
  phone: Joi.string().min(10).max(11),
  avatar: Joi.string(),
  address: Joi.string().max(100),
  // RoleId: Joi.number().required(),
});
const UserUpdateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).pattern(USERNAME_REGEX),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  firstName: Joi.string().min(3).max(30),
  lastName: Joi.string().min(3).max(30),
  email: Joi.string().min(10).pattern(EMAIL_REGEX),
  phone: Joi.string().min(10).max(11),
  avatar: Joi.string(),
  address: Joi.string().max(100),
});
export { Loginschema, UserSchema, UserUpdateSchema, changePasswordSchema };
