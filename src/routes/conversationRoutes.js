import {
  conversationController,
  getAllConversationsController,
} from '../controllers/conversationController';
import { verifyToken } from '../middleware/auth.js';
const express = require('express');
const conversationRouter = express.Router();
conversationRouter.get('/conversations', verifyToken, getAllConversationsController);
conversationRouter.get('/conversations/:receiverId', verifyToken, conversationController);

module.exports = conversationRouter;
