import { COURSE_CONSTANTS } from '../data/constant';
const APIError = require('../helper/apiError');
const Course = require('../database/models/course');
const SubCategory = require('../database/models/subCategory');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const createCourse = async (payload, currentUser) => {
  let t;
  try {
    t = await sequelize.transaction();
    const [newCourse, created] = await Course.findOrCreate({
      where: { courseName: payload.courseName },
      defaults: { ...payload, createdBy: currentUser },
      transaction: t,
      include: [{ model: SubCategory }],
    });
    await t.commit();
    if (created) {
      return newCourse;
    }
    return null;
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const updateCourse = async (payload, courseId) => {
  let t;
  try {
    t = await sequelize.transaction();
    const course = await Course.update({ ...payload }, { where: { courseId: courseId } });
    await t.commit();
    if (course > 0) {
      return course;
    }
    return null;
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const getCourse = async (courseId) => {
  const course = await Course.findOne({ where: { courseId: courseId } });
  if (course) {
    return course;
  }
  return null;
};
const getListCourse = async (pageIndex, pageSize) => {
  const courses = await Course.findAll();
  const totalCount = courses.length;
  if (!totalCount) {
    throw new APIError({ message: COURSE_CONSTANTS.COURSE_NOTFOUND, status: httpStatus.NOT_FOUND });
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
    courses,
    startIndex,
    endIndex,
  };
};
const deleteCourse = async (courseId) => {
  let t;
  try {
    t = await sequelize.transaction();
    const course = await Course.findOne({ where: { courseId: courseId } });
    if (course) {
      course.update({ isDeleted: true });
      await t.commit();
      return course;
    }
    return null;
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
export { createCourse, updateCourse, deleteCourse, getCourse, getListCourse };
