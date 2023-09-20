import { videoPlayer } from '../controllers/videoController';
import { verifyToken } from '../middleware/auth';
const express = require('express');
const videoRouter = express.Router();
videoRouter.get('/videos/:id', videoPlayer);
module.exports = videoRouter;
