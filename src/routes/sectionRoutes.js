const express = require('express');
const sectionRouter = express.Router();
import {
  getSectionController,
  createSectionController,
  updateSectionController,
} from '../controllers/sectionController';
import { verifyToken, authorize } from '../middleware/auth.js';

sectionRouter.get('/sections/:id', getSectionController);
sectionRouter.put('/sections/:id', verifyToken, updateSectionController);
sectionRouter.post('/sections/', verifyToken, createSectionController);

module.exports = sectionRouter;
