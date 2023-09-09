const subCategory = require('../database/models/subCategory');
const category = require('../database/models/category');
const { SUBCATEGORY_CONSTANTS, COMMON_CONSTANTS, CATEGORY_CONSTANTS } = require('../data/constant');
const APIError = require('../helper/apiError');
import httpStatus from 'http-status';
const { Op } = require('sequelize');
const createsubCategory = async (currentUser, subCateName, cateId) => {
  try {
    const cate = await category.findOne({ where: { cateId: cateId } });
    if (!cate) {
      return CATEGORY_CONSTANTS.CATEGORY_NOTFOUND;
    }
    const result = await subCategory.findOne({
      where: { subCateName: subCateName },
      include: [{ model: category, as: 'category' }],
    });
    if (result) {
      return SUBCATEGORY_CONSTANTS.SUBCATEGORY_EXIST;
    }
    const newsubCategory = await subCategory.create({
      subCateName: subCateName,
      createdBy: currentUser,
      cateId: cateId,
    });
    return newsubCategory;
  } catch (err) {
    console.error('Error:', err);
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const getsubCategory = async (subCategoryId) => {
  try {
    const result = await subCategory.findOne({ where: { cateId: subCategoryId } });
    if (!result) {
      return SUBCATEGORY_CONSTANTS.SUBCATEGORY_CONSTANTS.CATEGORY_NOTFOUND;
    }
    return result;
  } catch (err) {
    console.error('Error:', err);
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.BAD_REQUEST,
    });
  }
};
const getListsubCategory = async (pageIndex, pageSize) => {
  const subCategories = await subCategory.findAll();
  const totalCount = subCategories.length;
  if (!totalCount) {
    return SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND;
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  if (pageIndex > totalPages) {
    return COMMON_CONSTANTS.INVALID_PAGE;
  }
  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const silced = subCategories.slice(startIndex, endIndex);
  return {
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    startIndex,
    endIndex,
    silced,
  };
};
const updatesubCategory = async (payload, subCategoryId) => {
  try {
    const cate = await category.findOne({ where: { cateId: payload.cateId } });
    if (!cate) {
      return CATEGORY_CONSTANTS.CATEGORY_NOTFOUND;
    }
    const result = await subCategory.findOne({
      where: { cateId: subCategoryId },
      include: [{ model: category, as: 'category' }],
    });
    if (!result) {
      return SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND;
    }
    result.update({ cateName: payload.cateName });
    await result.save();
    return result;
  } catch (err) {
    console.error('Error:', err);
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.BAD_REQUEST,
    });
  }
};
const deletesubCategory = async (subCategoryId) => {
  try {
    const result = await subCategory.findOne({
      where: { [Op.and]: [{ subcateId: subCategoryId }, { isDeleted: false }] },
    });
    if (!result) {
      return SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND;
    }
    await result.update({ isDeleted: true });
    await result.save();
    return result;
  } catch (err) {
    console.error('Error:', err);
    throw new APIError({
      error: err,
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.BAD_REQUEST,
    });
  }
};
export {
  createsubCategory,
  getsubCategory,
  getListsubCategory,
  updatesubCategory,
  deletesubCategory,
};
