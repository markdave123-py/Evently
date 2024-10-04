import { EventService } from "../services/event.service.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { ReservationService } from "../../reservation/services/reservation.service.js";

export class EventController {
  static async createEvent(req, res, next) {
    try {
      const user = req.user;

      if (!user) {
        throw new ForbiddenError("you can't access this resource");
      }

      const eventData = { ...req.body, ownerId: user.id };

      const event = await EventService.createEvent(eventData);

      return res.status(HttpStatus.CREATED).json({
        message: "Event created successfully",
        data: event,
      });
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          : new InternalServerError(error.message)
      );
    }
  }

  static async getEvent(req, res, next) {
    const eventId = req.params.eventId;

    try {
      const event = await EventService.getEventById(eventId);

      const waitingList = await ReservationService.getWaitingCount(eventId);

      const availableTickets = event.totalTickets - event.soldTickets;

      return res.status(HttpStatus.OK).json({
        message: "Event fetched successfully",
        data: {
          EventId: event.id,
          EventName: event.name,
          availableTickets,
          waitingList,
        },
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
