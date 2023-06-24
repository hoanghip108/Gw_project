const express = require("express");
import { createUserController, loginController } from "../controllers/userController";
const userRouter = express.Router();
userRouter.post("/users/login", loginController);
userRouter.post("/users", createUserController);
export default userRouter;
