import {
  getListQuizController,
  getQuizController,
  createQuizController,
  updateQuizController,
  deleteQuizController,
} from '../controllers/quizController';
import { verifyToken, authorize } from '../middleware/auth.js';
const express = require('express');
const quizRouter = express.Router();
quizRouter.get('/quizzes', verifyToken, getListQuizController);
quizRouter.get('/quizzes/:id', verifyToken, getQuizController);
quizRouter.post('/quizzes', verifyToken, createQuizController);
quizRouter.put('/quizzes/:id', verifyToken, updateQuizController);
quizRouter.delete('/quizzes/:id', verifyToken, deleteQuizController);
module.exports = quizRouter;
