const Lesson = require('../database/models/lesson');
const Course = require('../database/models/course');
const Section = require('../database/models/section');
const APIError = require('../helper/apiError');
const { Op, where } = require('sequelize');
const { sequelize } = require('../config/database');
import ExcludedData from '../helper/excludeData';
const httpStatus = require('http-status');
import { COMMON_CONSTANTS, LESSON_CONSTANT, COURSE_CONSTANTS } from '../data/constant';
const createLesson = async (payload, videoPath, currentUser) => {
  let t;
  try {
    t = await sequelize.transaction();
    const section = await Section.findOne({ where: { sectionId: payload.sectionId } });
    if (section) {
      const newLesson = await Lesson.create(
        { ...payload, videoPath: videoPath, createdBy: currentUser },
        { transaction: t },
        { include: [{ model: Section }] },
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
      message: err.message,
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
  let offset = (pageIndex - 1) * pageSize;
  let limit = pageSize;
  const lessons = await Lesson.findAll();
  const totalCount = Lesson.count({ where: { isDeleted: false } }, { offset, limit });
  if (!totalCount) {
    return LESSON_CONSTANT.LESSON_NOTFOUND;
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
    lessons,
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
