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
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { verifyToken, authorize } from '../middleware/auth.js';
const lessonRouter = express.Router();

lessonRouter.post(
  '/lessons',
  verifyToken,
  authorize,
  upload.single('file'),
  createLessonController,
);
lessonRouter.get('/lessons', verifyToken, getListLessonController);
lessonRouter.get('/lessons/:id', verifyToken, getLessonController);
lessonRouter.delete('/lessons/:id', verifyToken, authorize, deleteLessonController);
lessonRouter.put(
  '/lessons/:id',
  verifyToken,
  authorize,
  upload.single('file'),
  updateLessonController,
);

lessonRouter.patch('/lessons/:id', upload.single('file'), uploadVideoController);
module.exports = lessonRouter;
