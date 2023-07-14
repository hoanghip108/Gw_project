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
  price: Joi.number(),
  isFree: Joi.boolean().required(),
  subCateId: Joi.number().required(),
  like: Joi.number(),
  dislike: Joi.number(),
});
export { courseSchema };
