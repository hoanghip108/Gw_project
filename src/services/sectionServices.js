const Section = require('../database/models/section');
const Course = require('../database/models/course');
const { sequelize } = require('../config/database');
import { SECTION_CONSTANT, COMMON_CONSTANTS } from '../data/constant';
import { courseId } from '../database/models/course/schema';
import APIError from '../helper/apiError';

import httpStatus from 'http-status';
const getSection = async (id) => {
  const result = await Section.findOne({ [Op.and]: [{ sectionId: id }, { isDeleted: false }] });
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
const createSection = async (payload, sectionId) => {
  let t;
  try {
    const section = await Section.findone({
      where: { [Op.and]: [{ sectionId: sectionId }, { isDeleted: false }] },
    });
    if (section) {
      return SECTION_CONSTANT.EXIST;
    }
    t = sequelize.Transaction();
    const course = Course.findOne({ where: { courseId: courseId } });
    const created = await Section.create(payload, { transaction: t });
    await t.commit();
    if (created) {
      return created;
    }
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.BAD_REQUEST,
    });
  }
};
