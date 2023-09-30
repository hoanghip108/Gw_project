import { COURSE_CONSTANTS, COMMON_CONSTANTS } from '../data/constant';
const APIError = require('../helper/apiError');
const Course = require('../database/models/course');
const SubCategory = require('../database/models/subCategory');
const Section = require('../database/models/section');
const Lesson = require('../database/models/lesson');
const { Op, where } = require('sequelize');
const { sequelize } = require('../config/database');
import httpStatus from 'http-status';
import ExcludedData from '../helper/excludeData';
const dataToExclude = [...Object.values(ExcludedData)];
const createCourse = async (payload, currentUser) => {
  let t;
  try {
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
      // message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      message: err.message,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const approveCourse = async (courseId, currentUser) => {
  let t;
  try {
    t = await sequelize.transaction();
    const course = await Course.update(
      { isApprove: true, updatedBy: currentUser },
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
      status: httpStatus.BAD_REQUEST,
    });
  }
};
const updateImg = async (Imgurl, courseId) => {
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
const updateCourse = async (payload, courseId, currentUser) => {
  let t;
  try {
    t = await sequelize.transaction();
    const existCourse = await Course.findOne({
      offset: 1,
      where: { courseName: payload.courseName },
    });
    if (existCourse) {
      return COURSE_CONSTANTS.COURSE_EXIST;
    }
    const course = await Course.findOne({ where: { courseId: courseId } });
    if (!course) {
      return COURSE_CONSTANTS.COURSE_NOTFOUND;
    }
    await course.update({ ...payload, updatedBy: currentUser }, { where: { courseId: courseId } });
    await t.commit();
    if (course) {
      return course;
    }
    return null;
  } catch (err) {
    await t.rollback();
    console.log(err.message);
    throw new APIError({
      errors: err.message,
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const getApprovedCourse = async (courseId) => {
  const course = await Course.findOne({
    where: { [Op.and]: [{ courseId: courseId }, { isApprove: true }, { isDeleted: false }] },
    attributes: { exclude: dataToExclude },
    include: [
      {
        model: Section,
        attributes: { exclude: dataToExclude },
        include: [{ model: Lesson, attributes: { exclude: dataToExclude + ['videoPath'] } }],
      },
    ],
  });
  if (course) {
    return course;
  }
  return null;
};
const getPendingCourse = async (courseId) => {
  const course = await Course.findOne({
    where: { [Op.and]: [{ courseId: courseId }, { isApprove: false }] },
    attributes: { exclude: dataToExclude },
    include: [
      {
        model: Section,
        attributes: { exclude: dataToExclude },
        include: [{ model: Lesson, attributes: { exclude: dataToExclude + ['videoPath'] } }],
      },
    ],
  });
  if (course) {
    return course;
  }
  return null;
};
const getListApprovedCourse = async (pageIndex, pageSize) => {
  const offset = (pageIndex - 1) * pageSize;
  const limit = pageSize;
  const courses = await Course.findAll(
    { where: { [Op.and]: [{ isApprove: true }, { isDeleted: false }] } },
    { offset, limit },
  );
  const totalCount = await Course.count({
    where: { [Op.and]: [{ isApprove: true }, { isDeleted: false }] },
  });
  if (!totalCount) {
    return COURSE_CONSTANTS.COURSE_NOTFOUND;
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
    courses,
  };
};
const getListPendingCourse = async (pageIndex, pageSize) => {
  const offset = (pageIndex - 1) * pageSize;
  const limit = pageSize;
  const courses = await Course.findAll({ where: { isApprove: false } }, { offset, limit });
  const totalCount = await Course.count();
  if (!totalCount) {
    return COURSE_CONSTANTS.COURSE_NOTFOUND;
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
    courses,
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
const searchCourse = async (keyword) => {
  const result = await Course.findAll({
    where: { [Op.and]: [{ courseName: { [Op.like]: `%${keyword}%` } }, { isApprove: true }] },
  });
  return result;
};
export {
  createCourse,
  updateCourse,
  deleteCourse,
  getApprovedCourse,
  getListApprovedCourse,
  getPendingCourse,
  getListPendingCourse,
  updateImg,
  approveCourse,
  searchCourse,
};
