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
import { courseSchema } from '../validators/courseValidate';
import { COURSE_CONSTANTS } from '../data/constant';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourse,
  getListCourse,
} from '../services/courseServices';
const createCourseController = async (req, res, next) => {
  try {
    const body = {
      courseName: req.body.courseName,
      description: req.body.description,
      price: req.body.price,
      isFree: req.body.isFree === '0',
      subCateId: req.body.subCateId,
      like: req.body.like || null,
      dislike: req.body.dislike || null,
      file: req.file,
    };
    const { error, value } = courseSchema.validate(body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    const file = value.file;
    const currentUser = req.user.userId;
    uploadImage(file)
      .then((imageUrl) => {
        console.log('Image uploaded successfully:', imageUrl);
        createCourse(value, currentUser, imageUrl);
        return res.status(httpStatus.OK).json(new Success());
      })
      .catch((error) => {
        console.error('Error uploading image:', error.message);
        return res.status(httpStatus.BAD_REQUEST).json(new BadRequest());
      });
  } catch (err) {
    next(err);
  }
};
const updateCourseController = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const body = {
      courseName: req.body.courseName,
      description: req.body.description,
      price: req.body.price,
      isFree: req.body.isFree === '0',
      subCateId: req.body.subCateId,
      like: req.body.like || null,
      dislike: req.body.dislike || null,
      file: req.file,
    };
    const { error, value } = courseSchema.validate(body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    uploadImage(body.file)
      .then((imageUrl) => {
        console.log('Image uploaded successfully:', imageUrl);
        const updatedCourse = updateCourse(value, courseId, imageUrl);
        if (updatedCourse) {
          return res.status(httpStatus.OK).json(new Success('', updatedCourse));
        }
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(new BadRequest(COURSE_CONSTANTS.COURSE_UPDATE_FAILED));
      })
      .catch((error) => {
        console.error('Error uploading image:', error.message);
        return res.status(httpStatus.BAD_REQUEST).json(new BadRequest());
      });
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
export {
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getCourseController,
  getListCourseController,
};
