import httpStatus from 'http-status';
const { SUBCATEGORY_CONSTANTS, COMMON_CONSTANTS, CATEGORY_CONSTANTS } = require('../data/constant');
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
const config = require('../config');
import {
  createsubCategory,
  getsubCategory,
  getListsubCategory,
  getByCategory,
  updatesubCategory,
  deletesubCategory,
} from '../services/subCategoryServices';
import { categorySchema } from '../validators/categoryValidate';
const createsubCategoryController = async (req, res, next) => {
  try {
    const currentUser = req.user.username;
    const subCateName = req.body.subCateName;
    const cateId = req.body.cateId;
    const result = await createsubCategory(currentUser, subCateName, cateId);
    if (result === SUBCATEGORY_CONSTANTS.SUBCATEGORY_EXIST) {
      return res
        .status(httpStatus.CONFLICT)
        .json(new Conflict(SUBCATEGORY_CONSTANTS.SUBCATEGORY_EXIST));
    } else if (result === CATEGORY_CONSTANTS.CATEGORY_NOTFOUND) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(CATEGORY_CONSTANTS.CATEGORY_NOTFOUND));
    }
    return res
      .status(httpStatus.CREATED)
      .json(new CreatedSuccess(SUBCATEGORY_CONSTANTS.CREATED, result));
  } catch (err) {
    next(err);
  }
};
const getsubCategoryController = async (req, res, next) => {
  try {
    const subCategoryId = req.params.id;
    const result = await getsubCategory(subCategoryId);
    if (result === SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('subCategory not found'));
    }
    return res.status(httpStatus.OK).json(new Success(SUBCATEGORY_CONSTANTS.FOUND, result));
  } catch (err) {
    next(err);
  }
};
const getListsubCategoryController = async (req, res, next) => {
  try {
    let pageIndex = parseInt(req.query.pageIndex);
    let pageSize = parseInt(req.query.pageSize);
    if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
      pageIndex = config.defaultIndexPagination;
      pageSize = config.defaultSizePagination;
    }
    const result = await getListsubCategory(pageIndex, pageSize);
    if (result === SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND) {
      return res.status(httpStatus.OK).json(new BadRequest('subCategory not found'));
    }
    if (result === COMMON_CONSTANTS.INVALID_PAGE) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Invalid page index'));
    }
    return res
      .status(httpStatus.OK)
      .json(
        new ApiPaginatedResponse(
          result.status,
          result.pageIndex,
          result.pageSize,
          result.totalCount,
          result.totalPages,
          result.subCategories,
        ),
      );
  } catch (err) {
    next(err);
  }
};
const getListsubCategoryByCategoryController = async (req, res, next) => {
  try {
    const cateId = req.params.id;
    const result = await getByCategory(cateId);
    if (result === SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND) {
      return res.status(httpStatus.OK).json(new BadRequest('subCategory not found'));
    }
    return res.status(httpStatus.OK).json(new Success(SUBCATEGORY_CONSTANTS.FOUND, result));
  } catch (err) {
    next(err);
  }
};
const updatesubCategoryController = async (req, res, next) => {
  try {
    const subCategoryId = req.params.id;
    const payload = req.body;
    const result = await updatesubCategory(payload, subCategoryId);
    if (result === SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('subCategory not found'));
    } else if (result === CATEGORY_CONSTANTS.CATEGORY_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('Category not found'));
    }
    return res.status(httpStatus.OK).json(new Success(SUBCATEGORY_CONSTANTS.UPDATED, result));
  } catch (err) {
    next(err);
  }
};
const deletesubCategoryController = async (req, res, next) => {
  try {
    const subCategoryId = req.params.id;
    const result = await deletesubCategory(subCategoryId);
    if (result === SUBCATEGORY_CONSTANTS.SUBCATEGORY_NOTFOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest('subCategory not found'));
    }
    return res.status(httpStatus.OK).json(new Success(SUBCATEGORY_CONSTANTS.DELETED, result));
  } catch (err) {
    next(err);
  }
};
export {
  createsubCategoryController,
  getsubCategoryController,
  getListsubCategoryController,
  getListsubCategoryByCategoryController,
  updatesubCategoryController,
  deletesubCategoryController,
};
