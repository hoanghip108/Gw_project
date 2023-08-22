import { createConversationController } from '../controllers/conversationController';
import { verifyToken, authorize } from '../middleware/auth.js';
const express = require('express');
const conversationRouter = express.Router();
conversationRouter.post('/conversation', verifyToken, createConversationController);

export default conversationRouter;
