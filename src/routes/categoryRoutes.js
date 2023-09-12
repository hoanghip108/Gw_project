const express = require('express');
const categoryRouter = express.Router();
const {
  createCategoryController,
  getCategoryController,
  updateCategoryController,
  getListCategoryController,
  deleteCategoryController,
} = require('../controllers/categoryController');
import { verifyToken, authorize } from '../middleware/auth';

categoryRouter.post('/categories', verifyToken, authorize, createCategoryController);
categoryRouter.get('/categories/:id', verifyToken, authorize, getCategoryController);
categoryRouter.get('/categories', getListCategoryController);
categoryRouter.put('/categories/:id', verifyToken, authorize, updateCategoryController);
categoryRouter.delete('/categories/:id', verifyToken, authorize, deleteCategoryController);
module.exports = categoryRouter;
