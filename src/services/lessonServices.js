const Lesson = require('../database/models/lesson');
const Course = require('../database/models/course');
const APIError = require('../helper/apiError');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
import ExcludedData from '../helper/excludeData';
const httpStatus = require('http-status');
import { COMMON_CONSTANTS, LESSON_CONSTANT, COURSE_CONSTANTS } from '../data/constant';
const createLesson = async (payload, videoPath, currentUser) => {
  let t;
  try {
    t = await sequelize.transaction();
    const course = await Course.findOne({ where: { courseId: payload.courseId } });
    if (course) {
      const newLesson = await Lesson.create(
        { ...payload, videoPath: videoPath, createdBy: currentUser },
        { transaction: t },
        { include: [{ model: Course }] },
      );
      await t.commit();
      if (!newLesson) {
        return 0;
      }

      return newLesson;
    }
    return null;
  } catch (err) {
    t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const updateLesson = async (payload, currentUser, lessonId, path) => {
  let t;
  try {
    t = await sequelize.transaction();
    const course = await Course.findOne({ where: { courseId: payload.courseId } });
    if (!course) {
      return COURSE_CONSTANTS.COURSE_NOTFOUND;
    }
    const lesson = await Lesson.update(
      { ...payload, updatedBy: currentUser, videoPath: path },
      { where: { lessonId: lessonId } },
    );
    await t.commit();
    if (lesson) {
      return lesson;
    }
    return null;
  } catch (err) {
    t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const dataToExclude = [...Object.values(ExcludedData)];
const getLesson = async (lessonId) => {
  const lesson = await Lesson.findOne({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ lessonId: lessonId }, { isDeleted: false }],
        },
        { lessonName: lessonId },
      ],
    },
    attributes: { exclude: dataToExclude },
  });
  if (lesson) {
    return lesson;
  }
  return null;
};
const getListLesson = async (pageIndex, pageSize) => {
  const lessons = await Lesson.findAll();
  const totalCount = lessons.length;
  if (!totalCount) {
    throw new APIError({ message: LESSON_CONSTANT.LESSON_NOTFOUND, status: httpStatus.NOT_FOUND });
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  if (pageIndex > totalPages) {
    throw new APIError({
      message: COMMON_CONSTANTS.INVALID_PAGE,
      status: httpStatus.BAD_REQUEST,
    });
  }

  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    lessons,
    startIndex,
    endIndex,
  };
};
const deleteLesson = async (lessonId) => {
  let t;
  try {
    t = await sequelize.transaction();
    const lesson = await Lesson.update(
      { isDeleted: true },
      { where: { [Op.and]: [{ lessonId: lessonId }, { isDeleted: false }] } },
    );
    if (lesson > 0) {
      return lesson;
    }
    return null;
  } catch (err) {
    t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const addLessonVideo = async (filePath, lessonId, payload) => {
  let t;
  try {
    t = await sequelize.transaction();
    const course = await Course.findOne({ where: { courseId: payload.courseId } });
    if (!course) {
      return COURSE_CONSTANTS.COURSE_NOTFOUND;
    }
    const lesson = await Lesson.findOne({ where: { lessonId: lessonId } });
    if (!lesson) {
      return LESSON_CONSTANT.LESSON_NOTFOUND;
    }
    await lesson.update({ videoPath: filePath });
    await t.commit();
    return lesson;
  } catch (err) {
    t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
export { createLesson, updateLesson, getLesson, getListLesson, deleteLesson, addLessonVideo };
