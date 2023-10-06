const express = require('express');
const subCategoryRouter = express.Router();
const {
  createsubCategoryController,
  getsubCategoryController,
  updatesubCategoryController,
  getListsubCategoryController,
  deletesubCategoryController,
} = require('../controllers/subCategoryController');
import { verifyToken, authorize } from '../middleware/auth';

subCategoryRouter.post('/sub-categories', verifyToken, authorize, createsubCategoryController);
subCategoryRouter.get('/sub-categories/:id', verifyToken, authorize, getsubCategoryController);
subCategoryRouter.get('/sub-categories', getListsubCategoryController);
subCategoryRouter.put('/sub-categories/:id', verifyToken, authorize, updatesubCategoryController);
subCategoryRouter.delete(
  '/sub-categories/:id',
  verifyToken,
  authorize,
  deletesubCategoryController,
);
module.exports = subCategoryRouter;
