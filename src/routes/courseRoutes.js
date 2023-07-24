import {
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getCourseController,
  getListCourseController,
} from '../controllers/courseController';
import { verifyToken, authorize } from '../middleware/auth.js';
const express = require('express');
const courseRouter = express.Router();

courseRouter.post('/courses', verifyToken,authorize, createCourseController);
courseRouter.get('/courses/:id', getCourseController);
courseRouter.get('/courses', getListCourseController);
courseRouter.put('/courses/:id',verifyToken,authorize, updateCourseController);
courseRouter.delete('/courses/:id',verifyToken,authorize, deleteCourseController);
export default courseRouter;
