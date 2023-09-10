import {
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getCourseController,
  getListCourseController,
  updateCourseImgController,
} from '../controllers/courseController';
import { verifyToken, authorize } from '../middleware/auth.js';
const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const courseRouter = express.Router();

courseRouter.post(
  '/courses',
  verifyToken,
  authorize,
  upload.single('file'),
  createCourseController,
);
courseRouter.get('/courses/:id', getCourseController);
courseRouter.get('/courses', getListCourseController);
courseRouter.patch(
  '/courses/:id',
  verifyToken,
  authorize,
  upload.single('file'),
  updateCourseController,
);
courseRouter.patch(
  '/courses/update-img/:id',
  verifyToken,
  authorize,
  upload.single('file'),
  updateCourseImgController,
);
courseRouter.delete('/courses/:id', verifyToken, authorize, deleteCourseController);
module.exports = courseRouter;
