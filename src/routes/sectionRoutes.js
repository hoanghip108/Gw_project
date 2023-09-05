const express = require('express');
const sectionRouter = express.Router();
import {
  getSectionController,
  createSectionController,
  updateSectionController,
} from '../controllers/sectionController';
import { verifyToken, authorize } from '../middleware/auth.js';

sectionRouter.get('/:id', getSectionController);
sectionRouter.put('/:id', verifyToken, updateSectionController);
sectionRouter.post('/', verifyToken, createSectionController);

module.exports = sectionRouter;
