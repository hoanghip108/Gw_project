const Quiz = require('../database/models/quiz');
import { COMMON_CONSTANTS, QUIZ_CONSTANTS } from '../data/constant';
import httpStatus from 'http-status';
const getListQuiz = async (pageIndex, pageSize) => {
  let offset = (pageIndex - 1) * pageSize;
  let limit = pageSize;
  const quizzes = await Quiz.findAll({
    where: { isDeleted: false },
    offset,
    limit,
  });
  const totalCount = await Quiz.count({ where: { isDeleted: false } }, { offset, limit });
  if (!totalCount) {
    return QUIZ_CONSTANTS.NOT_FOUND;
  }
  const totalPages = Math.ceil(totalCount / pageSize);
  if (pageIndex > totalPages) {
    return COMMON_CONSTANTS.INVALID_PAGE;
  }
  return {
    status: httpStatus.OK,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    quizzes,
  };
};
const getQuiz = async (quizId) => {
  const quiz = await Quiz.findOne({ where: { quizId: quizId, isDeleted: false } });
  if (!quiz) {
    return QUIZ_CONSTANTS.NOT_FOUND;
  }
  return quiz;
};
export { getListQuiz, getQuiz };
