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

const createQuizSchema = Joi.object({
  title: Joi.string().min(10).max(50).required().messages({
    'string.empty': 'title must not be empty',
    'any.required': 'title is required',
    'string.min': 'title must be at least 10 characters long',
    'string.max': 'title must have maximum 50 characters',
  }),

  sectionId: Joi.string().required().messages({
    'string.empty': 'sectionId must not be empty',
    'any.required': 'sectionId is required',
  }),
});
export { createQuizSchema };
