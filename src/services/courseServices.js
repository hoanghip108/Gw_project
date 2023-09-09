import { COURSE_CONSTANTS, COMMON_CONSTANTS } from '../data/constant';
const APIError = require('../helper/apiError');
const Course = require('../database/models/course');
const SubCategory = require('../database/models/subCategory');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
import httpStatus from 'http-status';
const createCourse = async (payload, currentUser) => {
  let t;
  try {
    console.log(payload);
    t = await sequelize.transaction();
    const subcate = await SubCategory.findOne({ where: { subCateId: payload.subCateId } });
    if (!subcate) {
      return SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND;
    }
    const result = await Course.findOne({
      where: { courseName: payload.courseName },
      include: [{ model: SubCategory }],
    });
    if (result) {
      return COURSE_CONSTANTS.COURSE_EXIST;
    }
    const course = await Course.create({ ...payload, createdBy: currentUser }, { transaction: t });
    await t.commit();
    if (course) {
      return course;
    }
    return null;
  } catch (err) {
    console.log(err.message);
    await t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const saveImage = async (Imgurl, courseId) => {
  let t;
  try {
    t = await sequelize.transaction();
    const course = await Course.update({ courseImg: Imgurl }, { where: { courseId: courseId } });
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
const updateCourse = async (payload, courseId, imageUrl) => {
  let t;
  try {
    t = await sequelize.transaction();
    const course = await Course.update(
      { ...payload, courseImg: imageUrl },
      { where: { courseId: courseId } },
    );
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
export { createCourse, updateCourse, deleteCourse, getCourse, getListCourse, saveImage };
