import { Router } from "express";
import { UserController } from "../controllers/signup.js";
import { signupValidator } from "../validators/signup.validator.js";
import { validateSchema } from "../../core/utils/validateSchema.js";


export const userRouter = Router();

userRouter.post("/signup", validateSchema(signupValidator), UserController.signup);