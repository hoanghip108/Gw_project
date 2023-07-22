const Lesson = require('../database/models/lesson');
const Course = require('../database/models/course');
const APIError = require('../helper/apiError');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
import { COMMON_CONSTANTS, LESSON_CONSTANT } from '../data/constant';
const createLesson = async (payload, currentUser) => {
  let t;
  try {
    t = await sequelize.transaction();
    const course = await Course.findOne({ where: { courseId: payload.courseId } });
    if (course) {
      const [newLesson, created] = await Lesson.findOrCreate({
        where: { lessonName: payload.lessonName },
        defaults: { ...payload, createdBy: currentUser },
        transaction: t,
        include: [{ model: Course }],
      });
      await t.commit();
      if (!created) {
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
const updateLesson = async (payload, lessonId) => {
  let t;
  try {
    t = await sequelize.transaction();
    const lesson = await Lesson.update({ ...payload }, { where: { lessonId: lessonId } });
    await t.commit();
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
const getLesson = async (lessonId) => {
  const lesson = await Lesson.findOne({
    where: { [Op.and]: [{ lessonId: lessonId }, { isDeleted: false }] },
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
    const lesson = await Lesson.update({ isDeleted: true }, { where: { lessonId: lessonId } });
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
export { createLesson, updateLesson, getLesson, getListLesson, deleteLesson };