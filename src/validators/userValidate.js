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
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
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
const AvatarUpdateSchema = Joi.object({
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    destination: Joi.string(),
    filename: Joi.string(),
    path: Joi.string(),
    buffer: Joi.binary(),
    size: Joi.number(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png').required(), // Adjust valid mimetypes
  }).required(),
});
export { Loginschema, UserSchema, UserUpdateSchema, changePasswordSchema, AvatarUpdateSchema };
