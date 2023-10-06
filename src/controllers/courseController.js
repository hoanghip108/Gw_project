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
import { uploadImage } from '../helper/uploadFile';
import { courseSchema, courseUpdateSchema, ImageUploadSchema } from '../validators/courseValidate';
import { COURSE_CONSTANTS, SUBCATEGORY_CONSTANTS, COMMON_CONSTANTS } from '../data/constant';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getApprovedCourse,
  getListApprovedCourse,
  getPendingCourse,
  getListPendingCourse,
  getListDeletedCourse,
  updateImg,
  approveCourse,
  restoreCourse,
  searchCourse,
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
const getapprovedCourseController = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await getApprovedCourse(courseId);
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
const getPendingCourseController = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await getPendingCourse(courseId);
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
const getListApprovedCourseController = async (req, res, next) => {
  try {
    let pageIndex = parseInt(req.query.pageIndex);
    let pageSize = parseInt(req.query.pageSize);
    if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
      pageIndex = config.defaultIndexPagination;
      pageSize = config.defaultSizePagination;
    }
    const result = await getListApprovedCourse(pageIndex, pageSize);
    if (result == COURSE_CONSTANTS.COURSE_NOTFOUND) {
      return res.status(httpStatus.OK).json(new Success(COURSE_CONSTANTS.COURSE_NOTFOUND, []));
    } else if (result == COMMON_CONSTANTS.INVALID_PAGE) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(COMMON_CONSTANTS.INVALID_PAGE));
    }
    return res
      .status(httpStatus.OK)
      .json(
        new ApiPaginatedResponse(
          result.status,
          result.pageIndex,
          result.pageSize,
          result.totalCount,
          result.totalPages,
          result.courses,
        ),
      );
  } catch (error) {
    next(error);
  }
};
const getListPendingCourseController = async (req, res, next) => {
  try {
    let pageIndex = parseInt(req.query.pageIndex);
    let pageSize = parseInt(req.query.pageSize);
    if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
      pageIndex = config.defaultIndexPagination;
      pageSize = config.defaultSizePagination;
    }
    const result = await getListPendingCourse(pageIndex, pageSize);
    if (result == COURSE_CONSTANTS.COURSE_NOTFOUND) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(COURSE_CONSTANTS.COURSE_NOTFOUND));
    } else if (result == COMMON_CONSTANTS.INVALID_PAGE) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(COMMON_CONSTANTS.INVALID_PAGE));
    }
    return res
      .status(httpStatus.OK)
      .json(
        new ApiPaginatedResponse(
          result.status,
          result.pageIndex,
          result.pageSize,
          result.totalCount,
          result.totalPages,
          result.courses,
        ),
      );
  } catch (error) {
    next(error);
  }
};
const getistDeletedCourseController = async (req, res, next) => {
  try {
    let pageIndex = parseInt(req.query.pageIndex);
    let pageSize = parseInt(req.query.pageSize);
    if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
      pageIndex = config.defaultIndexPagination;
      pageSize = config.defaultSizePagination;
    }
    const result = await getListDeletedCourse(pageIndex, pageSize);
    if (result == COURSE_CONSTANTS.COURSE_NOTFOUND) {
      console.log('not found');
      return res.status(httpStatus.OK).json(new Success(COURSE_CONSTANTS.COURSE_NOTFOUND, []));
    } else if (result == COMMON_CONSTANTS.INVALID_PAGE) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(COMMON_CONSTANTS.INVALID_PAGE));
    }
    return res
      .status(httpStatus.OK)
      .json(
        new ApiPaginatedResponse(
          result.status,
          result.pageIndex,
          result.pageSize,
          result.totalCount,
          result.totalPages,
          result.courses,
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
const approveCourseController = async (req, res, next) => {
  try {
    const currentUser = req.user.username;
    const courseId = req.params.id;
    const result = await approveCourse(courseId, currentUser);
    if (result == null) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(COURSE_CONSTANTS.COURSE_NOTFOUND));
    }
    return res.status(httpStatus.OK).json(new Success(COURSE_CONSTANTS.APPROVED, result));
  } catch (err) {
    next(err);
  }
};
const rejectCourseController = async (req, res, next) => {};
const restoreCourseController = async (req, res, next) => {
  try {
    const currentUser = req.user.username;
    const courseId = req.params.id;
    const result = await restoreCourse(courseId, currentUser);
    if (result == null) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(COURSE_CONSTANTS.COURSE_NOTFOUND));
    }
    return res.status(httpStatus.OK).json(new Success(COURSE_CONSTANTS.RESTORED, result));
  } catch (err) {
    next(err);
  }
};
const searchCourseController = async (req, res, next) => {
  try {
    const search = req.query.search;
    const result = searchCourse(search);
    if (result) {
      return res.status(httpStatus.OK).json(new Success('', result));
    }
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(new BadRequest(COURSE_CONSTANTS.COURSE_NOTFOUND));
  } catch (err) {
    next(err);
  }
};
export {
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getapprovedCourseController,
  getListApprovedCourseController,
  getPendingCourseController,
  getListPendingCourseController,
  getistDeletedCourseController,
  updateCourseImgController,
  approveCourseController,
  restoreCourseController,
  searchCourseController,
};
