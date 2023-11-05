const express = require('express');
const sectionRouter = express.Router();
import {
  getSectionController,
  createSectionController,
  updateSectionController,
  uploadDocsController,
} from '../controllers/sectionController';
import { verifyToken, authorize } from '../middleware/auth.js';

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

sectionRouter.get('/sections/:id', getSectionController);
sectionRouter.put('/sections/:id', verifyToken, updateSectionController);
sectionRouter.post('/sections/:courseId', verifyToken, createSectionController);
sectionRouter.patch('/sections/:id', upload.single('file'), uploadDocsController);

module.exports = sectionRouter;
