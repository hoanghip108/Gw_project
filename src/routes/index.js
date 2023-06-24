import userRouter from "./userRoutes";
const express = require("express");
const routers = express.Router();
routers.use(userRouter);
export default routers;
