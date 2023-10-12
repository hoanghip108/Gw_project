const express = require('express');
const subCategoryRouter = express.Router();
const {
  createsubCategoryController,
  getsubCategoryController,
  updatesubCategoryController,
  getListsubCategoryByCategoryController,
  getListsubCategoryController,
  deletesubCategoryController,
} = require('../controllers/subCategoryController');
import { verifyToken } from '../middleware/auth';

subCategoryRouter.post('/sub-categories', verifyToken, createsubCategoryController);
subCategoryRouter.get('/sub-categories/:id', verifyToken, getsubCategoryController);
subCategoryRouter.get('/sub-categories', getListsubCategoryController);
subCategoryRouter.get('/sub-categories/by-category/:id', getListsubCategoryByCategoryController);
subCategoryRouter.put('/sub-categories/:id', verifyToken, updatesubCategoryController);
subCategoryRouter.delete('/sub-categories/:id', verifyToken, deletesubCategoryController);
module.exports = subCategoryRouter;
