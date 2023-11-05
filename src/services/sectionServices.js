const Section = require('../database/models/section');
const Course = require('../database/models/course');
const { sequelize } = require('../config/database');
import { SECTION_CONSTANT, COMMON_CONSTANTS, COURSE_CONSTANTS } from '../data/constant';
import { courseId } from '../database/models/course/schema';
import APIError from '../helper/apiError';
import httpStatus from 'http-status';
const { Op } = require('sequelize');
import ExcludedData from '../helper/excludeData';
const dataToExclude = ['videoPath', ...Object.values(ExcludedData)];
const getSection = async (id) => {
  const result = await Section.findOne({
    where: { [Op.and]: [{ sectionId: id }, { isDeleted: false }] },
    attributes: { exclude: dataToExclude },
  });
  if (!result) {
    return SECTION_CONSTANT.NOT_FOUND;
  }
  return result;
};
const getListSection = async (pageIndex, pageSize) => {
  const sections = await Section.findAll();
  const totalCount = sections.length;
  if (!totalCount) {
    return SECTION_CONSTANT.NOT_FOUND;
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  if (pageIndex > totalPages) {
    return COMMON_CONSTANTS.INVALID_PAGE;
  }

  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    sections,
    startIndex,
    endIndex,
  };
};
const createSection = async (sections, currentUser, courseId) => {
  let t;
  try {
    t = await sequelize.transaction();
    for (let i = 0; i < sections.length; i++) {
      const course = await Course.findOne({ where: { courseId: courseId } });
      if (!course) {
        return COURSE_CONSTANTS.COURSE_NOTFOUND;
      }
      let section;
      let created;
      try {
        [section, created] = await Section.findOrCreate({
          where: { sectionName: sections[i].sectionName },
          defaults: {
            createdBy: currentUser,
            sectionName: sections[i].sectionName,
            courseId: courseId,
          },
          transaction: t,
        });
        if (!created) {
          await t.rollback();
          return SECTION_CONSTANT.EXIST;
        }
        return sections;
      } catch (err) {
        console.log(err.message);
        await t.rollback();
        throw new APIError({
          message: COMMON_CONSTANTS.TRANSACTION_ERROR,
          status: httpStatus.BAD_REQUEST,
        });
      }
    }
    await t.commit();
    return sections;
  } catch (err) {
    console.log(err.message);
    await t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.BAD_REQUEST,
    });
  }
};
const updateSection = async (payload, sectionId, currentUser) => {
  let t;
  try {
    const courseId = payload.courseId;
    t = await sequelize.transaction();
    const course = await Course.findOne({ where: { courseId: courseId } });
    if (!course) {
      return COURSE_CONSTANTS.COURSE_NOTFOUND;
    }
    const section = await Section.findOne({ where: { sectionId: sectionId } });
    if (!section) {
      return SECTION_CONSTANT.NOT_FOUND;
    }
    const result = await Section.update(
      { ...payload, updatedBy: currentUser },
      { where: { sectionId: sectionId } },
      { transaction: t },
    );
    await t.commit();
    if (result > 0) {
      return result;
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
export { getSection, getListSection, createSection, updateSection };
