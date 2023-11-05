import Joi from 'joi';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_REGEX,
  NAME_REGEX,
  TIME_REGEX,
  TIME_WITH_SECOND_REGEX,
  PHONE_NUMBER_REGEX,
} from '../utils/regex';

const courseSchema = Joi.object({
  courseName: Joi.string().min(3).max(500).required().messages({
    'string.min': 'Course name must have at least 3 characters',
    'string.max': 'Course name must have maximum 500 characters',
    'any.required': 'Course name is required',
    'string.empty': 'Course name must not be empty',
  }),
  description: Joi.string().messages({
    'string.empty': 'Description must not be empty',
  }),
  price: Joi.number().required().messages({
    'number.base': 'Price must be a number',
    'number.empty': 'Price must not be empty',
    'any.required': 'Price is required',
  }),
  isFree: Joi.boolean().required().messages({
    'boolean.base': 'isFree must be a boolean',
    'boolean.empty': 'isFree must not be empty',
    'any.required': 'isFree is required',
  }),
  subCateId: Joi.string().required().messages({
    'string.empty': 'Subcategory id must not be empty',
    'any.required': 'Subcategory id is required',
  }),
  like: Joi.number().messages({
    'number.base': 'Like must be a number',
  }),
  dislike: Joi.number().messages({
    'number.base': 'Dislike must be a number',
  }),
  brief: Joi.string().messages({
    'string.empty': 'Brief must not be empty',
  }),
  knowledge: Joi.string().messages({
    'array.base': 'Knowledge must be an array',
  }),
  requirement: Joi.string().messages({
    'array.base': 'Requirement must be an array',
  }),
  // file: Joi.binary().required(),
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    destination: Joi.string(),
    filename: Joi.string(),
    path: Joi.string(),
    buffer: Joi.binary(),
    size: Joi.number(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png').required().messages({
      'string.empty': 'Mimetype is required',
      'any.required': 'Mimetype is required',
      'any.only': 'Mimetype must be image/jpeg or image/png',
    }), // Adjust valid mimetypes
  }).required(),
});
const courseUpdateSchema = Joi.object({
  courseName: Joi.string().min(3).max(500).required(),
  description: Joi.string(),
  price: Joi.number().required(),
  isFree: Joi.boolean().required(),
  subCateId: Joi.number().required(),
  like: Joi.number(),
  dislike: Joi.number(),
});
const ImageUploadSchema = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  destination: Joi.string(),
  filename: Joi.string(),
  path: Joi.string(),
  buffer: Joi.binary().required(),
  size: Joi.number().required(),
  mimetype: Joi.string().valid('image/jpeg', 'image/png', 'video/mp4').required(), // Adjust valid mimetypes
});
export { courseSchema, courseUpdateSchema, ImageUploadSchema };
