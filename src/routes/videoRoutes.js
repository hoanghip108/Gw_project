import { videoPlayer } from '../controllers/videoController';
const express = require('express');
const videoRouter = express.Router();
videoRouter.get('/videos/:id', videoPlayer);
export default videoRouter;
