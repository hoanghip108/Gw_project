const express = require("express");
import {
  createUserController,
  loginController,
  verifyUserController,
} from "../controllers/userController";
const userRouter = express.Router();
userRouter.post("/users/auth/login", loginController);
userRouter.post("/users/auth/register", createUserController);
userRouter.get("/users/auth/register/verify/:id", verifyUserController);
export default userRouter;
