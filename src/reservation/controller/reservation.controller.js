import { ApiError } from "../../core/errors/apiErrors.js";
import { ConflictError } from "../../core/errors/conflictError.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { rabbitMQManager } from "../../core/utils/rabbitmq.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { EventService } from "../../event/services/event.service.js";
import { ReservationService } from "../services/reservation.service.js";

export class ReservationController {
  static async createReservation(req, res, next) {
    try {
      const user = req.user;

      if (!user) {
        throw new ForbiddenError(
          "You can't access this endpoint unless you login"
        );
      }

      const { eventId } = req.body;

      const event = await EventService.getEventById(eventId);

      if (!event) {
        throw new ConflictError("Event does not exist");
      }

      const userId = user.id;

      const reservationExists = await ReservationService.getReservation(
        userId,
        eventId
      );

      if (reservationExists) {
        throw new ConflictError(
          "You have already reserved a ticket for this event"
        );
      }

      await rabbitMQManager.publishToQueue({ eventId, userId });

      const isSoldOut = event.soldTickets >= event.totalTickets;

      if (isSoldOut) {
        return res.status(HttpStatus.ACCEPTED).json({
          message:
            "The event is sold out, you have been added to the waiting list.",
          status: "waiting",
        });
      } else {
        return res.status(HttpStatus.ACCEPTED).json({
          message: "Your reservation has been successfully queued.",
          status: "booked",
        });
      }
    } catch (error) {
      next( 
        error instanceof ApiError
          ? error
          : new InternalServerError(error.message)
      );
    }
  }

  static async cancelReservation(req, res, next) {
    try {
      const user = req.user;
      const { eventId } = req.body;

      const result = await ReservationService.cancelReservation(
        eventId,
        user.id
      );

      return res.status(HttpStatus.OK).json({
        message: result.message,
      });
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          : new InternalServerError(error.message)
      );
    }
  }
}
