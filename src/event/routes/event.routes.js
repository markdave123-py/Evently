import { Router } from "express";
import { EventController } from "../controllers/event.controller.js";
import { eventValidator } from "../validators/event.validator.js";
import { validateSchema } from "../../core/utils/validateSchema.js";
import { authGuard } from "../../auth/authGuard/currentUser.js";



export const eventRouter = Router();


eventRouter.post('/initialize', authGuard.guard, validateSchema(eventValidator), EventController.createEvent);
eventRouter.get('/:eventId', EventController.getEvent);