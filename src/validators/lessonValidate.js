import Joi from 'joi';
const lessonSchema = Joi.object({
  lessonName: Joi.string().min(3).max(500).required(),
  grade: Joi.number(),
  courseId: Joi.string().required(),
  videoPath: Joi.string(),
});
export { lessonSchema };
