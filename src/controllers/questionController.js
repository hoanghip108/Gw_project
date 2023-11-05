import { createQuestion } from '../services/questionServices.js';
import httpStatus from 'http-status';
import { QUESTION_CONSTANTS } from '../data/constant';

const createQuestionController = async (req, res, next) => {
  try {
    const data = req.body;
    const currentUser = req.user.userId;
    const result = await createQuestion(currentUser, data);
    // console.log('this is questions', newQuestions);
    return res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      message: QUESTION_CONSTANTS.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export { createQuestionController };
