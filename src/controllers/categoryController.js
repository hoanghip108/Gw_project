import httpStatus from 'http-status';
const { CATEGORY_CONSTANTS, COMMON_CONSTANTS } = require('../data/constant');
const {
  Common,
  Success,
  CreatedSuccess,
  DeletedSuccess,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  ValidateFailed,
  WrongUsernameOrpassWord,
  ApiPaginatedResponse,
} = require('../helper/apiResponse');
import {
  createCategory,
  getCategory,
  getListCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryServices';
const createCategoryController = async (req, res, next) => {
  try {
    const currentUser = req.user.username;
    const cateName = req.body.cateName;
    const result = await createCategory(currentUser, cateName);
    if (result === CATEGORY_CONSTANTS.CATEGORY_EXIST) {
      return res.status(httpStatus.CONFLICT).json(new Conflict('Category already exists'));
    }
    return res
      .status(httpStatus.CREATED)
      .json(new CreatedSuccess(CATEGORY_CONSTANTS.CREATED, result));
  } catch (err) {
    next(err);
  }
};
const getCategoryController = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const result = await getCategory(categoryId);
    if (result === CATEGORY_CONSTANTS.CATEGORY_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Category not found'));
    }
    return res.status(httpStatus.OK).json(new Success(CATEGORY_CONSTANTS.FOUND, result));
  } catch (err) {
    next(err);
  }
};
const getListCategoryController = async (req, res, next) => {
  try {
    const pageIndex = req.query.pageIndex;
    const pageSize = req.query.pageSize;
    const result = await getListCategory(pageIndex, pageSize);
    if (result === CATEGORY_CONSTANTS.CATEGORY_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Category not found'));
    }
    if (result === COMMON_CONSTANTS.INVALID_PAGE) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Invalid page index'));
    }
    return res.status(httpStatus.OK).json(new ApiPaginatedResponse(result));
  } catch (err) {
    next(err);
  }
};
const updateCategoryController = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const cateName = req.body.cateName;
    const result = await updateCategory(cateName, categoryId);
    if (result === CATEGORY_CONSTANTS.CATEGORY_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Category not found'));
    }
    return res.status(httpStatus.OK).json(new Success(CATEGORY_CONSTANTS.UPDATED, result));
  } catch (err) {
    next(err);
  }
};
const deleteCategoryController = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const result = await deleteCategory(categoryId);
    if (result === CATEGORY_CONSTANTS.CATEGORY_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Category not found'));
    }
    return res.status(httpStatus.OK).json(new Success(CATEGORY_CONSTANTS.DELETED, result));
  } catch (err) {
    next(err);
  }
};
export {
  createCategoryController,
  getCategoryController,
  getListCategoryController,
  updateCategoryController,
  deleteCategoryController,
};