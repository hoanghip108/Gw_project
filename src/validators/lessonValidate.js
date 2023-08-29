import Joi from 'joi';
const lessonSchema = Joi.object({
  lessonName: Joi.string().min(3).max(500).required(),
  grade: Joi.number(),
  courseId: Joi.string().required(),
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
export { lessonSchema };
