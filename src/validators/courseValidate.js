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
  courseName: Joi.string().min(3).max(500).required(),
  description: Joi.string(),
  price: Joi.number().required(),
  isFree: Joi.boolean().required(),
  subCateId: Joi.number().required(),
  like: Joi.number(),
  dislike: Joi.number(),
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
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'video/mp4').required(), // Adjust valid mimetypes
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
