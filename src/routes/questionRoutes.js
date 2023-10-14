import { createQuestionController } from '../controllers/questionController.js';
import { verifyToken, authorize } from '../middleware/auth.js';
const express = require('express');
const questionRouter = express.Router();

questionRouter.post('/questions', verifyToken, createQuestionController);

module.exports = questionRouter;
