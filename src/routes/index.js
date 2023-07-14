import userRouter from './userRoutes';
import videoRouter from './videoRoutes';
import courseRouter from './courseRoutes';
const express = require('express');
const routers = express.Router();
routers.use(userRouter);
routers.use(videoRouter);
routers.use(courseRouter);
export default routers;
