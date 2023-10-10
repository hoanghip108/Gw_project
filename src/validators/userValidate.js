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
      'any.required': 'username is required',
      'string.empty': 'username must not be empty',
      'string.pattern.base': 'username must not have special characters',
    }),
  password: Joi.string().required().messages({
    'string.empty': 'password must not be empty',
    'any.required': 'password is required',
  }),
});
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    'string.empty': 'Old password must not be empty',
    'any.required': 'Old password is required',
  }),
  newPassword: Joi.string().required().messages({
    'string.empty': 'New password must not be empty',
    'any.required': 'New password is required',
  }),
});
const UserSchema = Joi.object({
  username: Joi.string().min(8).max(15).regex(USERNAME_REGEX).required().messages({
    'string.min': 'username must be at least 8 characters long',
    'string.max': 'username must have maximum 15 characters',
    'string.empty': 'username must not be empty',
    'string.pattern.base': 'username must not have special characters',
    'any.required': 'username is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'password must not be empty',
    'any.required': 'password is required',
  }),
  firstName: Joi.string().min(2).max(10).required().messages({
    'string.min': 'First name must have at least 2 characters',
    'string.max': 'First name must have maximum 10 characters',
    'any.required': 'First name is required',
    'string.empty': 'First name must not be empty',
  }),
  lastName: Joi.string().min(2).max(10).required().messages({
    'string.min': 'Last name must have at least 2 characters',
    'string.max': 'Last name must have maximum 10 characters',
    'any.required': 'Last name is required',
    'string.empty': 'Last name must not be empty',
  }),
  email: Joi.string().min(10).max(30).regex(EMAIL_REGEX).required().messages({
    'string.min': 'Email must have at least 10 characters',
    'string.max': 'Email must have maximum 30 characters',
    'string.pattern.base': 'Email must have @ characters',
    'any.required': 'Email is required',
    'string.empty': 'Email must not be empty',
  }),
  phoneNumber: Joi.string().min(10).max(11).pattern(PHONE_NUMBER_REGEX).required().messages({
    'string.min': 'Phone number must have at least 10 characters',
    'string.max': 'Phone number must have maximum 11 characters',
    'string.pattern.base': 'Phone number must have number characters',
    'any.required': 'Phone number is required',
    'string.empty': 'Phone number must not be empty',
  }),
  avatar: Joi.string(),
  address: Joi.string().max(100).messages({
    'string.max': 'Address must have maximum 100 characters',
  }),
});
const UserUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(10).required().messages({
    'string.min': 'First name must have at least 2 characters',
    'string.max': 'First name must have maximum 10 characters',
    'any.required': 'First name is required',
    'string.empty': 'First name must not be empty',
  }),
  lastName: Joi.string().min(2).max(10).required().messages({
    'string.min': 'Last name must have at least 2 characters',
    'string.max': 'Last name must have maximum 10 characters',
    'any.required': 'Last name is required',
    'string.empty': 'Last name must not be empty',
  }),
  phoneNumber: Joi.string().min(10).max(11).pattern(PHONE_NUMBER_REGEX).messages({
    'string.min': 'Phone number must have at least 10 characters',
    'string.max': 'Phone number must have maximum 11 characters',
    'string.pattern.base': 'Phone number must have number characters',
    'string.empty': 'Phone number must not be empty',
  }),
  avatar: Joi.string(),
  address: Joi.string().max(100).messages({
    'string.max': 'Address must have maximum 100 characters',
  }),
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
    mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
  }), // Adjust valid mimetypes
})
  .required()
  .messages({
    'any.required': 'File is required',
    'string.empty': 'File must not be empty',
  });
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'refreshToken must not be empty',
    'any.required': 'refreshToken is required',
  }),
});
const changeUserRoleSchema = Joi.object({
  roleId: Joi.number().required().messages({
    'number.base': 'roleId must be a number',
    'any.required': 'roleId is required',
  }),
});
export {
  Loginschema,
  UserSchema,
  UserUpdateSchema,
  changePasswordSchema,
  AvatarUpdateSchema,
  refreshTokenSchema,
  changeUserRoleSchema,
};
