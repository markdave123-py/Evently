import { sequelizeConn } from "../../core/config/database.js";
import { NotFoundError } from "../../core/errors/notFoundError.js";
import { UnProcessableError } from "../../core/errors/unProcessableError.js";
import Event from "../../event/models/event.model.js";
import { logger } from "../../core/loggers/logger.js";
import Reservation from "../models/reservation.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import e from "express";

export class ReservationService {
  static async createReservation(eventId, userId) {
    const transaction = await sequelizeConn.transaction();

    try {
      const event = await Event.findByPk(eventId, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!event) {
        throw new NotFoundError("Event not found");
      }

      let reservation = await Reservation.findOne({
        where: {
          eventId,
          userId,
        },
      });

      if (reservation) {
        throw new UnProcessableError(
          "You have already reserved a ticket for this event"
        );
      }

      let status;

      if (event.soldTickets >= event.totalTickets) {
        status = "waiting";
        logger.info(
          `User ${userId} added to the waiting list for event ${event.id}`
        );
      } else {
        status = "booked";
        event.soldTickets += 1;
        await event.save({ transaction });
        logger.info(`Event ${event.id} sold tickets increased by 1`);
      }

      reservation = await Reservation.create(
        {
          eventId,
          userId,
          status,
        },
        { transaction }
      );

      await transaction.commit();

      return reservation;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof NotFoundError) {
        throw new NotFoundError(error.message);
      } else if (error instanceof UnProcessableError) {
        throw new UnProcessableError(error.message);
      } else {
        throw new InternalServerError(error.message);
      }
    }
  }

  static async getReservation(userId, eventId) {
    try {
      const reservation = await Reservation.findOne({
        where: {
          userId,
          eventId,
        },
      });

      return reservation;
    } catch (error) {
      throw new UnProcessableError(error.message);
    }
  }

  static async cancelReservation(eventId, userId) {
    const transaction = await sequelizeConn.transaction();

    try {
      const reservation = await Reservation.findOne({
        where: {
          eventId,
          userId,
          status: "booked",
        },
        transaction,
      });

      if (!reservation) {
        throw new NotFoundError("No booked reservation found for this user.");
      }

      await reservation.update({ status: "cancelled" }, { transaction });
      logger.info(
        `Reservation for user ${userId} for event ${eventId} has been canceled`
      );

      const waitingReservation = await Reservation.findOne({
        where: {
          eventId,
          status: "waiting",
        },
        order: [["createdAt", "ASC"]],
        transaction,
      });

      if (waitingReservation) {
        await waitingReservation.update({ status: "booked" }, { transaction });
        logger.info(
          `Ticket assigned to user ${waitingReservation.userId} from the waiting list`
        );
      } else {
        const event = await Event.findByPk(eventId, { transaction });
        event.soldTickets -= 1;
        await event.save({ transaction });
        logger.info(
          `Event ${event.id} sold tickets decreased by 1 due to cancellation`
        );
      }

      await transaction.commit();

      return { message: "Reservation successfully canceled." };
    } catch (error) {
      await transaction.rollback();
      if (error instanceof NotFoundError) {
        return { message: "No booked reservation found for this user." };
      } else {
        throw new InternalServerError(
          error.message,
          "couldn't cancel the reservation!!"
        );
      }
    }
  }

  static async getWaitingCount(eventId) {
    try {
      const count = await Reservation.count({
        where: {
          eventId,
          status: "waiting",
        },
      });
        return count;
    } catch (error) {
      throw new UnProcessableError(error.message);
    }
  }
}
