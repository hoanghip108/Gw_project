import Joi from 'joi';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_REGEX,
  NAME_REGEX,
  TIME_REGEX,
  TIME_WITH_SECOND_REGEX,
  PHONE_NUMBER_REGEX,
  STRING_REGEX,
} from '../utils/regex';

const sectionSchema = Joi.object({
  sectionName: Joi.string().min(3).max(20).pattern(STRING_REGEX).required().messages({
    'string.min': 'Section name must have at least 3 characters',
    'string.max': 'Section name must have maximum 500 characters',
    'any.required': 'Section name is required',
    'string.empty': 'Section name must not be empty',
    'string.pattern.base': 'Section name must not have special characters',
  }),
  courseId: Joi.string().required().messages({
    'string.empty': 'Course id must not be empty',
    'any.required': 'Course id is required',
  }),
});
export { sectionSchema };
