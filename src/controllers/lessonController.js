import { LESSON_CONSTANT } from '../data/constant';
import {
  createLesson,
  getListLesson,
  deleteLesson,
  updateLesson,
  getLesson,
} from '../services/lessonServices';
import { lessonSchema } from '../validators/lessonValidate';
const config = require('../config');
const httpStatus = require('http-status');
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
const createLessonController = async (req, res, next) => {
  const { error, value } = lessonSchema.validate(req.body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
  }
  const currentUser = req.user.username;
  const newLesson = await createLesson(value, currentUser);
  if (newLesson == 0) {
    return res.status(httpStatus.CONFLICT).json(new Conflict(LESSON_CONSTANT.LESSON_EXIST));
  } else if (newLesson == null) {
    return res.status(httpStatus.NOT_FOUND).json(new NotFound(LESSON_CONSTANT.COURSE_NOTFOUND));
  }
  return res.status(httpStatus.OK).json(new Success('', newLesson));
};
const getListLessonController = async (req, res, next) => {
  try {
    let pageIndex = parseInt(req.query.pageIndex);
    let pageSize = parseInt(req.query.pageSize);
    if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
      pageIndex = config.defaultIndexPagination;
      pageSize = config.defaultSizePagination;
    }
    const result = await getListLesson(pageIndex, pageSize);
    return res
      .status(httpStatus.OK)
      .json(
        new ApiPaginatedResponse(
          result.pageIndex,
          result.pageSize,
          result.totalCount,
          result.totalPages,
          result.lessons.slice(result.startIndex, result.endIndex),
        ),
      );
  } catch (error) {
    next(error);
  }
};
const getLessonController = async (req, res, next) => {
  try {
    const lessonId = req.params.lessonId;
    const lesson = await getLesson(lessonId);
    if (lesson == null) {
      return res.status(httpStatus.NOT_FOUND).json(new NotFound(LESSON_CONSTANT.LESSON_NOTFOUND));
    }
    return res.status(httpStatus.OK).json(new Success('', lesson));
  } catch (err) {
    next(err);
  }
};
const updateLessonController = async (req, res, next) => {
  try {
    const { error, value } = lessonSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    const currentUser = req.user.username;
    const updated = await updateLesson(value, currentUser);
    if (updated) {
      return res.status(httpStatus.OK).json(new Success(LESSON_CONSTANT.UPDATE_SUCCESS));
    }
    return res.status(httpStatus.BAD_REQUEST).json(new NotFound(LESSON_CONSTANT.UPDATE_FAILED));
  } catch (err) {
    next(err);
  }
};
const deleteLessonController = async (req, res, next) => {
  try {
    const lessonId = req.params.lessonId;
    const lesson = await deleteLesson(lessonId);
    if (lesson == null) {
      return res.status(httpStatus.NOT_FOUND).json(new NotFound(LESSON_CONSTANT.LESSON_NOTFOUND));
    }
    return res.status(httpStatus.OK).json(new Success(LESSON_CONSTANT.DELETE_SUCCESS));
  } catch (err) {
    next(err);
  }
};
export {
  createLessonController,
  getListLessonController,
  getLessonController,
  deleteLessonController,
  updateLessonController,
};
