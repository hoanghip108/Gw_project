const express = require('express');
import {
  createLessonController,
  getListLessonController,
  getLessonController,
  deleteLessonController,
  updateLessonController,
  uploadVideoController,
} from '../controllers/lessonController';
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { verifyToken } from '../middleware/auth.js';
const lessonRouter = express.Router();

lessonRouter.post(
  '/lessons',
  verifyToken,

  upload.single('file'),
  createLessonController,
);
lessonRouter.get('/lessons', getListLessonController);
lessonRouter.get('/lessons/:id', verifyToken, getLessonController);
lessonRouter.delete('/lessons/:id', verifyToken, deleteLessonController);
lessonRouter.put(
  '/lessons/:id',
  verifyToken,

  upload.single('file'),
  updateLessonController,
);

lessonRouter.patch('/lessons/:id', upload.single('file'), uploadVideoController);
module.exports = lessonRouter;
