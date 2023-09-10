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
const formidable = require('formidable');
const fs = require('fs');
import { uploadImage } from '../helper/uploadFile';
import { courseSchema, courseUpdateSchema, ImageUploadSchema } from '../validators/courseValidate';
import { COURSE_CONSTANTS, SUBCATEGORY_CONSTANTS } from '../data/constant';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourse,
  getListCourse,
  updateImg,
} from '../services/courseServices';
const createCourseController = async (req, res, next) => {
  try {
    const body = {
      courseName: req.body.courseName,
      description: req.body.description,
      price: req.body.price,
      isFree: req.body.isFree,
      subCateId: req.body.subCateId,
      like: req.body.like,
      dislike: req.body.dislike,
      file: req.file,
    };
    const { error, value } = courseSchema.validate(body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    const file = value.file;
    const currentUser = req.user.userId;
    const result = await createCourse(value, currentUser);
    if (result === SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND));
    } else if (result === COURSE_CONSTANTS.COURSE_EXIST) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(COURSE_CONSTANTS.COURSE_EXIST));
    }
    const courseId = result.courseId;
    uploadImage(file, courseId).then((imgUrl) => {
      if (imgUrl) {
        updateImg(imgUrl, courseId);
        return res.status(httpStatus.OK).json(new Success(COURSE_CONSTANTS.CREATED, result));
      }
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(COURSE_CONSTANTS.CREATED));
    });
  } catch (err) {
    next(err);
  }
};
const updateCourseController = async (req, res, next) => {
  try {
    const currentUser = req.user.username;
    const courseId = req.params.id;
    const { error, value } = courseUpdateSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    const result = await updateCourse(value, courseId, currentUser);
    if (result === COURSE_CONSTANTS.COURSE_EXIST) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(COURSE_CONSTANTS.COURSE_EXIST));
    } else if (result === COURSE_CONSTANTS.COURSE_NOTFOUND) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(COURSE_CONSTANTS.COURSE_NOTFOUND));
    }
    return res.status(httpStatus.OK).json(new Success(COURSE_CONSTANTS.UPDATED, result));
  } catch (err) {
    next(err);
  }
};
const getCourseController = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await getCourse(courseId);
    if (course) {
      return res.status(httpStatus.OK).json(new Success('', course));
    }
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(new BadRequest(COURSE_CONSTANTS.COURSE_NOTFOUND));
  } catch (err) {
    next(err);
  }
};
const getListCourseController = async (req, res, next) => {
  try {
    let pageIndex = parseInt(req.query.pageIndex);
    let pageSize = parseInt(req.query.pageSize);
    if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
      pageIndex = config.defaultIndexPagination;
      pageSize = config.defaultSizePagination;
    }
    const result = await getListCourse(pageIndex, pageSize);
    return res
      .status(httpStatus.OK)
      .json(
        new ApiPaginatedResponse(
          result.pageIndex,
          result.pageSize,
          result.totalCount,
          result.totalPages,
          result.courses.slice(result.startIndex, result.endIndex),
        ),
      );
  } catch (error) {
    next(error);
  }
};
const deleteCourseController = async (req, res, next) => {
  try {
    let courseId = req.params.id;
    const course = await deleteCourse(courseId);
    if (course) {
      return res.status(httpStatus.OK).json(new Success('', course));
    }
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(new BadRequest(COURSE_CONSTANTS.COURSE_DELETE_FAILED));
  } catch (err) {
    next(err);
  }
};
const updateCourseImgController = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const file = req.file;
    console.log(req.file);
    if (file === undefined) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('File is empty'));
    }
    const { error, value } = ImageUploadSchema.validate(file);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    console.log(value);
    uploadImage(value, courseId).then((imgUrl) => {
      if (imgUrl) {
        updateImg(imgUrl, courseId);
        return res.status(httpStatus.OK).json(new Success(COURSE_CONSTANTS.CREATED));
      }
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Upload image failed'));
    });
  } catch (err) {
    next(err);
  }
};
export {
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getCourseController,
  getListCourseController,
  updateCourseImgController,
};
