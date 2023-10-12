const express = require('express');
const categoryRouter = express.Router();
const {
  createCategoryController,
  getCategoryController,
  updateCategoryController,
  getListCategoryController,
  deleteCategoryController,
} = require('../controllers/categoryController');
import { verifyToken } from '../middleware/auth';

categoryRouter.post('/categories', verifyToken, createCategoryController);
categoryRouter.get('/categories/:id', verifyToken, getCategoryController);
categoryRouter.get('/categories', getListCategoryController);
categoryRouter.put('/categories/:id', verifyToken, updateCategoryController);
categoryRouter.delete('/categories/:id', verifyToken, deleteCategoryController);
module.exports = categoryRouter;
