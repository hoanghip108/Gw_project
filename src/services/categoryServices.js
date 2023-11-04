const Category = require('../database/models/category');
const { CATEGORY_CONSTANTS, COMMON_CONSTANTS } = require('../data/constant');
const APIError = require('../helper/apiError');
import httpStatus from 'http-status';
const { Op } = require('sequelize');
import ExcludedData from '../helper/excludeData';
const dataToExclude = [...Object.values(ExcludedData)];
import { getOne } from '../coreFunctions/getOne';
const createCategory = async (currentUser, payload) => {
  try {
    const category = await Category.findOne({ where: { cateName: payload.cateName } });
    if (category) {
      return CATEGORY_CONSTANTS.CATEGORY_EXIST;
    }
    const newCategory = await Category.create({
      cateName: payload.cateName,
      createdBy: currentUser,
    });
    return newCategory;
  } catch (err) {
    console.error('Error:', err);
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const getCategory = async (categoryId) => {
  try {
    // const category = await Category.findOne({ where: { cateId: categoryId } });
    const category = await getOne(Category)({ cateId: categoryId });
    if (!category) {
      return CATEGORY_CONSTANTS.CATEGORY_NOTFOUND;
    }
    return category;
  } catch (err) {
    console.error('Error:', err);
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.BAD_REQUEST,
    });
  }
};
const getListCategory = async (pageIndex, pageSize) => {
  const offset = (pageIndex - 1) * pageSize;
  const limit = pageSize;
  const categories = await Category.findAll(
    { attributes: { exclude: ['isDeleted', 'createdBy', 'updatedBy'] } },
    { offset, limit },
  );
  const totalCount = await Category.count();

  if (!totalCount) {
    return CATEGORY_CONSTANTS.CATEGORY_NOTFOUND;
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
    categories,
  };
};
const updateCategory = async (cateName, categoryId) => {
  try {
    const category = await Category.findOne({ where: { cateId: categoryId } });
    if (!category) {
      return CATEGORY_CONSTANTS.CATEGORY_NOTFOUND;
    }
    category.update({ cateName: cateName });
    await category.save();
    return category;
  } catch (err) {
    console.error('Error:', err);
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.BAD_REQUEST,
    });
  }
};
const deleteCategory = async (categoryId) => {
  try {
    const category = await Category.findOne({
      where: { [Op.and]: [{ cateId: categoryId }, { isDeleted: false }] },
    });
    if (!category) {
      return CATEGORY_CONSTANTS.CATEGORY_NOTFOUND;
    }
    const result = await category.update({ isDeleted: true });
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
export { createCategory, getCategory, getListCategory, updateCategory, deleteCategory };
