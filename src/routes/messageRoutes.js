import { sendMessageController } from '../controllers/messageController';
import { verifyToken, authorize } from '../middleware/auth.js';
const express = require('express');
const messageRouter = express.Router();
messageRouter.post('/message/:conversationId', verifyToken, sendMessageController);

export default messageRouter;
