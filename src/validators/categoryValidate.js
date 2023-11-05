import Joi from 'joi';
import { STRING_REGEX } from '../utils/regex';
const categorySchema = Joi.object({
  cateName: Joi.string().min(10).max(50).required().regex(STRING_REGEX).message({
    'string.min': 'Category name must have at least 10 characters',
    'string.max': 'Category name must have maximum 50 characters',
    'string.empty': 'Category name must not be empty',
    'string.pattern.base': 'Category must not have special characters and number',
  }),
});
export { categorySchema };
