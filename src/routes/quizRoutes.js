import { getListQuizController, getQuizController } from '../controllers/quizController';
import { verifyToken, authorize } from '../middleware/auth.js';
const express = require('express');
const quizRouter = express.Router();
quizRouter.get('/quizzes', verifyToken, getListQuizController);
quizRouter.get('/quizzes/:id', verifyToken, getQuizController);

module.exports = quizRouter;
