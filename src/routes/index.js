import userRouter from './userRoutes';
import videoRouter from './videoRoutes';
const express = require('express');
const routers = express.Router();
routers.use(userRouter);
routers.use(videoRouter);
export default routers;
