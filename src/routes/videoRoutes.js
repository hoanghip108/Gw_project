import { videoPlayer } from '../controllers/videoController';
const express = require('express');
const videoRouter = express.Router();
videoRouter.get('/videos/:filename', videoPlayer);

export default videoRouter;
