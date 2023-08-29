const httpStatus = require('http-status');
import { sendMessage } from '../services/messageServices';

const sendMessageController = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const conversationId = req.params.conversationId;
    const payload = req.body;
    const message = await sendMessage(senderId, conversationId, payload);
    if (!message) {
      return res.status(httpStatus.CONFLICT).json();
    }
    return res.status(httpStatus.OK).json(message);
  } catch (err) {
    next(err);
  }
};
export { sendMessageController };
