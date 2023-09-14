const httpStatus = require('http-status');
import { sendMessage } from '../services/messageServices';

const sendMessageController = async (req, res, next) => {
  try {
    // const senderId = req.user.userId;
    const senderId = 1;
    const conversationId = 1;
    const payload = req.body;
    // const io = res.io;
    _io.emit('receive_message', payload);
    _io.on('connection', (socket) => {
      console.log('A user connected');
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
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
