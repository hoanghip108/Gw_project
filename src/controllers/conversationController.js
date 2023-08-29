const config = require('../config');
const httpStatus = require('http-status');
import { getConversation, getAllConversations } from '../services/conversationServices';
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
const conversationController = async (req, res, next) => {
  try {
    debugger;
    const senderId = req.user.userId;
    const receiverId = req.params.receiverId;
    const conversation = await getConversation(senderId, receiverId);
    if (!conversation) {
      return res.status(httpStatus.CONFLICT).json();
    }
    return res.status(httpStatus.OK).json(conversation);
  } catch (err) {
    next(err);
  }
};
const getAllConversationsController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const conversations = await getAllConversations(userId);
    if (!conversations) {
      return res.status(httpStatus.CONFLICT).json();
    }
    return res.status(httpStatus.OK).json(conversations);
  } catch (err) {
    next(err);
  }
};
export { conversationController, getAllConversationsController };
