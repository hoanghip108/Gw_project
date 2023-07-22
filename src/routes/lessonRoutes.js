const express = require('express');
import {
  createLessonController,
  getListLessonController,
  deleteLessonController,
  updateLessonController,
} from '../controllers/lessonController';
import { verifyToken, authorize } from '../middleware/auth.js';
const lessonRouter = express.Router();

lessonRouter.post('/lessons', verifyToken, createLessonController);
lessonRouter.get('/lessons', verifyToken, getListLessonController);
lessonRouter.delete('/lessons/:id', verifyToken, deleteLessonController);
lessonRouter.put('/lessons/:id', verifyToken, updateLessonController);
export default lessonRouter;
