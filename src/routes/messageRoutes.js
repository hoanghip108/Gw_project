import { getMessagesController, sendMessageController } from '../controllers/messageController';
import { verifyToken, authorize } from '../middleware/auth.js';
const express = require('express');
const messageRouter = express.Router();

messageRouter.get('/messages/:id', verifyToken, getMessagesController);
messageRouter.post('/messages/:id', verifyToken, sendMessageController);

module.exports = messageRouter;
