import {
  conversationController,
  getAllConversationsController,
} from '../controllers/conversationController';
import { verifyToken, authorize } from '../middleware/auth.js';
const express = require('express');
const conversationRouter = express.Router();
conversationRouter.get('/conversations', verifyToken, getAllConversationsController);
conversationRouter.get('/conversations/:receiverId', verifyToken, conversationController);

export default conversationRouter;
