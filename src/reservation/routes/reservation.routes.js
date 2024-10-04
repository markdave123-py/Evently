import { Router } from "express";
import { ReservationController } from "../controller/reservation.controller.js";
import { validateSchema } from "../../core/utils/validateSchema.js";
import { reservationSchema } from "../validators/reservation.validators.js";
import { authGuard } from "../../auth/authGuard/currentUser.js";

export const reservationRouter = Router();

reservationRouter.post(
  "/create",
  authGuard.guard,
  validateSchema(reservationSchema),
  ReservationController.createReservation
);
reservationRouter.post(
  "/cancel",
  authGuard.guard,
  validateSchema(reservationSchema),
  ReservationController.cancelReservation
);
