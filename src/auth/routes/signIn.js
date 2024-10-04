import { validateSchema } from "../../core/utils/validateSchema.js";
import { Router } from "express";
import { signInSchema } from "../validator/signin.validator.js";
import { AuthController } from "../controllers/signIn.js";

export const authRouter = Router();


authRouter.post("/signin", validateSchema(signInSchema), AuthController.signIn);
