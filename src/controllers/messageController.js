const httpStatus = require('http-status');
import { getMessages, sendMessage } from '../services/messageServices';

const getMessagesController = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;
    const receiverId = req.params.id;
    const messages = await getMessages(currentUserId, receiverId);
    if (messages == null) {
      return res.status(httpStatus.CONFLICT).json();
    }

    return res.status(httpStatus.OK).json(messages);
  } catch (err) {
    next(err);
  }
};
const sendMessageController = async (req, res, next) => {
  try {
    const senderId = req.user.userId;

    const conversationId = req.body.conversationId;
    const receiverId = req.params.id;
    const payload = req.body;
    const message = await sendMessage(senderId, receiverId, conversationId, payload);
    if (!message) {
      return res.status(httpStatus.CONFLICT).json();
    }
    return res.status(httpStatus.OK).json(message);
  } catch (err) {
    next(err);
  }
};

export { getMessagesController, sendMessageController };
