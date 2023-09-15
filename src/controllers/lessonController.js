import { COURSE_CONSTANTS, LESSON_CONSTANT } from '../data/constant';
import {
  createLesson,
  getListLesson,
  deleteLesson,
  updateLesson,
  getLesson,
  addLessonVideo,
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
import { uploadVideo } from '../helper/uploadFile';
const createLessonController = async (req, res, next) => {
  const { error, value } = lessonSchema.validate({
    lessonName: req.body.lessonName,
    grade: req.body.grade,
    courseId: req.body.courseId,
    file: req.file,
  });

  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
  }

  const currentUser = req.user.username;
  const videoPath = req.file.path || null;
  console.log('this is video path', videoPath);
  const lesson = await getLesson(value.lessonName);
  if (!lesson) {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    // const cldRes = await uploadVideo(dataURI);
    const urlVideo = await uploadVideo(dataURI).then((result) => {
      console.log('Image uploaded successfully:', result);
      return result.url;
    });
    const newLesson = await createLesson(value, urlVideo, currentUser);
    if (newLesson == 0) {
      return res.status(httpStatus.CONFLICT).json(new Conflict(LESSON_CONSTANT.LESSON_EXIST));
    } else if (newLesson == null) {
      return res.status(httpStatus.NOT_FOUND).json(new NotFound(LESSON_CONSTANT.COURSE_NOTFOUND));
    }
    return res.status(httpStatus.OK).json(new Success('', newLesson));
  }
  return res.status(httpStatus.CONFLICT).json(new Conflict(LESSON_CONSTANT.LESSON_EXIST));
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
    const lessonId = req.params.id;
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
    const { error, value } = lessonSchema.validate({
      lessonName: req.body.lessonName,
      grade: req.body.grade,
      courseId: req.body.courseId,
      file: req.file,
    });
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.details[0].message));
    }
    const videoPath = req.file.path || null;
    const currentUser = req.user.username;
    const lessonId = req.params.id;

    debugger;
    uploadVideo(videoPath)
      .then((videoUrl) => {
        console.log('Image uploaded successfully:', videoUrl);
        updateLesson(value, currentUser, lessonId, videoUrl);
        return res.status(httpStatus.OK).json(new Success());
      })
      .catch((error) => {
        console.error('Error uploading image:', error.message);
        return res.status(httpStatus.BAD_REQUEST).json(new BadRequest());
      });
    // const updated = await updateLesson(value, currentUser, lessonId, result.secure_url);
    // if (updated == null) {
    //   return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(LESSON_CONSTANT.UPDATE_FAILED));
    // } else if (updated == COURSE_CONSTANTS.COURSE_NOTFOUND) {
    //   return res
    //     .status(httpStatus.BAD_REQUEST)
    //     .json(new BadRequest(COURSE_CONSTANTS.COURSE_NOTFOUND));
    // }
    // return res.status(httpStatus.OK).json(new Success(LESSON_CONSTANT.UPDATE_SUCCESS));
  } catch (err) {
    next(err);
  }
};
const deleteLessonController = async (req, res, next) => {
  try {
    const lessonId = req.params.id;
    const lesson = await deleteLesson(lessonId);
    if (lesson == null) {
      return res.status(httpStatus.NOT_FOUND).json(new NotFound(LESSON_CONSTANT.LESSON_NOTFOUND));
    }
    return res.status(httpStatus.OK).json(new Success(LESSON_CONSTANT.DELETE_SUCCESS));
  } catch (err) {
    next(err);
  }
};
const uploadVideoController = async (req, res, next) => {
  try {
    const filePath = req.file.path;
    const lessonId = req.params.id;
    const payload = req.body;
    const result = addLessonVideo(filePath, lessonId, payload);
    if (result != null) {
      return res.status(httpStatus.OK).json(new Success());
    }
    return res.status(httpStatus.BAD_REQUEST).json(new BadRequest());
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
  uploadVideoController,
};
