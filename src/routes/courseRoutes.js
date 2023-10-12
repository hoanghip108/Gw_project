import {
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getapprovedCourseController,
  getListApprovedCourseController,
  getPendingCourseController,
  getListPendingCourseController,
  getistDeletedCourseController,
  updateCourseImgController,
  approveCourseController,
  restoreCourseController,
  searchCourseController,
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
courseRouter.get('/courses/deleted', verifyToken, getistDeletedCourseController);
courseRouter.get('/courses/search', searchCourseController);
courseRouter.get('/courses/pending/:id', verifyToken, getPendingCourseController);
courseRouter.get('/courses/pending', verifyToken, getListPendingCourseController);
courseRouter.get('/courses/:id', getapprovedCourseController);
courseRouter.get('/courses', getListApprovedCourseController);
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
courseRouter.patch('/courses/approve/:id', verifyToken, approveCourseController);
courseRouter.patch('/courses/restore/:id', verifyToken, restoreCourseController);
courseRouter.delete('/courses/:id', verifyToken, deleteCourseController);
courseRouter.delete('/courses/:id', verifyToken, deleteCourseController);
module.exports = courseRouter;
