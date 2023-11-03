const subCategory = require('../database/models/subCategory');
const category = require('../database/models/category');
const { SUBCATEGORY_CONSTANTS, COMMON_CONSTANTS, CATEGORY_CONSTANTS } = require('../data/constant');
const APIError = require('../helper/apiError');
import httpStatus from 'http-status';
const { Op, where } = require('sequelize');
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
    const result = await subCategory.findOne({ where: { subCateId: subCategoryId } });
    if (!result) {
      return SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND;
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
const getByCategory = async (cateId) => {
  try {
    const result = await subCategory.findAll({
      where: { cateId: cateId, isDeleted: false },
      include: [{ model: category, as: 'category' }],
    });
    if (!result) {
      return SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND;
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
  const offset = (pageIndex - 1) * pageSize;
  const limit = pageSize;
  const subCategories = await subCategory.findAll({ where: { isDeleted: false }, offset, limit });
  const totalCount = await subCategory.count(where({ isDeleted: false }));
  // console.log('this is total count', totalCount);
  if (!totalCount) {
    return SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND;
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
    subCategories,
  };
};
const updatesubCategory = async (payload, subCategoryId) => {
  try {
    console.log('this is payload', payload);
    const cate = await category.findOne({ where: { cateId: payload.cateId } });
    if (!cate) {
      return CATEGORY_CONSTANTS.CATEGORY_NOTFOUND;
    }
    const result = await subCategory.findOne({
      where: { subCateId: subCategoryId },
      include: [{ model: category, as: 'category' }],
    });
    if (!result) {
      return SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND;
    }
    await result.update({ subCateName: payload.subCateName, cateId: payload.cateId });
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
  getByCategory,
  updatesubCategory,
  deletesubCategory,
};
