const config = require('../config');
const httpStatus = require('http-status');
import { createConversation } from '../services/conversationService';
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
import { COURSE_CONSTANTS } from '../data/constant';
const createConversationController = async (req, res, next) => {
  try {
    const currentUser = req.user.username;
    const receiverId = req.body.receiverId;
    console.log(currentUser);
    const conversation = await createConversation(currentUser, receiverId);
    if (!conversation) {
      return res.status(httpStatus.CONFLICT).json();
    }
    return res.status(httpStatus.OK).json(conversation);
  } catch (err) {
    next(err);
  }
};
export { createConversationController };
