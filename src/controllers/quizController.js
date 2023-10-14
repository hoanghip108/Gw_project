import { getListQuiz, getQuiz, createQuiz, updateQuiz, deleteQuiz } from '../services/quizServices';
import { COMMON_CONSTANTS, QUIZ_CONSTANTS } from '../data/constant';
import httpStatus from 'http-status';
import { createQuizSchema } from '../validators/quizValidate';
const {
  Common,
  Success,
  CreatedSuccess,
  DeletedSuccess,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  ValidateFailed,
  WrongUsernameOrpassWord,
  ApiPaginatedResponse,
} = require('../helper/apiResponse');
const config = require('../config');
const getListQuizController = async (req, res, next) => {
  try {
    let pageIndex = parseInt(req.query.pageIndex);
    let pageSize = parseInt(req.query.pageSize);
    if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
      pageIndex = config.defaultIndexPagination;
      pageSize = config.defaultSizePagination;
    }
    const result = await getListQuiz(pageIndex, pageSize);
    if (result === QUIZ_CONSTANTS.NOT_FOUND) {
      return res.status(httpStatus.NOT_FOUND).json(new BadRequest(QUIZ_CONSTANTS.NOT_FOUND));
    }
    if (result === COMMON_CONSTANTS.INVALID_PAGE) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(COMMON_CONSTANTS.INVALID_PAGE));
    }
    return res.status(httpStatus.OK).json(new Success(COMMON_CONSTANTS.SUCCESS, result));
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const getQuizController = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const result = await getQuiz(quizId);
    if (result === QUIZ_CONSTANTS.NOT_FOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Quiz not found'));
    }
    return res.status(httpStatus.OK).json(new Success(QUIZ_CONSTANTS.FOUND, result));
  } catch (err) {
    next(err);
  }
};
const createQuizController = async (req, res, next) => {
  const { err, value } = createQuizSchema.validate(req.body);
  if (err) {
    return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(err));
  }
  const currentUser = req.user.userId;
  try {
    const result = await createQuiz(currentUser, value);
    if (result === QUIZ_CONSTANTS.INVALID_AUTHOR) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(QUIZ_CONSTANTS.INVALID_AUTHOR));
    }
    if (result === QUIZ_CONSTANTS.CREATED_FAILED) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(QUIZ_CONSTANTS.CREATED_FAILED));
    }
    return res.status(httpStatus.CREATED).json(new CreatedSuccess(QUIZ_CONSTANTS.CREATED, result));
  } catch (err) {
    next(err);
  }
};
const updateQuizController = async (req, res, next) => {
  const { err, value } = createQuizSchema.validate(req.body);
  if (err) {
    return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(err));
  }
  const currentUser = req.user.userId;
  const quizId = req.params.id;
  try {
    const result = await updateQuiz(currentUser, quizId, value);
    if (result === QUIZ_CONSTANTS.INVALID_AUTHOR) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(QUIZ_CONSTANTS.INVALID_AUTHOR));
    }
    if (result === QUIZ_CONSTANTS.NOT_FOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(QUIZ_CONSTANTS.NOT_FOUND));
    }
    if (result === QUIZ_CONSTANTS.UPDATED_FAILED) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(QUIZ_CONSTANTS.UPDATED_FAILED));
    }
    return res.status(httpStatus.OK).json(new Success(QUIZ_CONSTANTS.UPDATED, result));
  } catch (err) {
    next(err);
  }
};
const deleteQuizController = async (req, res, next) => {
  try {
    const currentUser = req.user.userId;
    const quizId = req.params.id;
    const result = await deleteQuiz(currentUser, quizId);
    if (result === QUIZ_CONSTANTS.INVALID_AUTHOR) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(QUIZ_CONSTANTS.INVALID_AUTHOR));
    }
    if (result === QUIZ_CONSTANTS.NOT_FOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(QUIZ_CONSTANTS.NOT_FOUND));
    }
    return res.status(httpStatus.OK).json(new Success(QUIZ_CONSTANTS.DELETED));
  } catch (err) {
    next(err);
  }
};
export {
  getListQuizController,
  getQuizController,
  createQuizController,
  updateQuizController,
  deleteQuizController,
};
