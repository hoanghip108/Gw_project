import {
  getSection,
  getListSection,
  createSection,
  updateSection,
} from '../services/sectionServices';
import { uploadDocument } from '../helper/uploadFile';
import { SECTION_CONSTANT, COMMON_CONSTANTS, COURSE_CONSTANTS } from '../data/constant';
import { sectionSchema } from '../validators/sectionValidate';
const httpStatus = require('http-status');
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
const getSectionController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await getSection(id);
    if (result === SECTION_CONSTANT.NOT_FOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(SECTION_CONSTANT.NOT_FOUND));
    }
    return res.status(httpStatus.OK).json(new Success(SECTION_CONSTANT.FOUND, result));
  } catch (err) {
    return next(err);
  }
};
const getListSectionController = async (req, res, next) => {};
const createSectionController = async (req, res, next) => {
  try {
    const sections = req.body;
    for (let i = 0; i < sections.length; i++) {
      const { error, value } = sectionSchema.validate(sections[i]);
      if (error) {
        return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(error.message));
      }
    }
    const currentUser = req.user.userId;
    const result = await createSection(sections, currentUser);
    if (result === COURSE_CONSTANTS.COURSE_NOTFOUND) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(COURSE_CONSTANTS.COURSE_NOTFOUND));
    } else if (result === SECTION_CONSTANT.EXIST) {
      return res.status(httpStatus.CONFLICT).json(new Conflict(SECTION_CONSTANT.EXIST));
    }
    return res.status(httpStatus.OK).json(new Success(SECTION_CONSTANT.CREATED, result));
  } catch (err) {
    return next(err);
  }
};
const uploadDocsController = async (req, res, next) => {
  try {
    const file = req.file;
    console.log(file);
    const documents = await uploadDocument(file);
    return res.status(httpStatus.OK).json(new Success(COMMON_CONSTANTS.UPLOADED, documents));
  } catch (err) {}
};
const updateSectionController = async (req, res, next) => {
  try {
    const payload = req.body;
    const sectionId = req.params.id;
    const currentUser = req.user.username;
    const result = await updateSection(payload, sectionId, currentUser);
    if (result === COURSE_CONSTANTS.COURSE_NOTFOUND) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new BadRequest(COURSE_CONSTANTS.COURSE_NOTFOUND));
    } else if (result === SECTION_CONSTANT.NOT_FOUND) {
      return res.status(httpStatus.BAD_REQUEST).json(new BadRequest(SECTION_CONSTANT.NOT_FOUND));
    }
    return res.status(httpStatus.OK).json(new Success(SECTION_CONSTANT.UPDATED, result));
  } catch (err) {
    return next(err);
  }
};
const createQuizzController = async (req, res, next) => {};
export {
  getSectionController,
  createSectionController,
  updateSectionController,
  uploadDocsController,
};
