import { UnProcessableError } from "../../core/errors/unProcessableError.js";
import { logger } from "../../core/loggers/logger.js";
import { rabbitMQManager } from "../../core/utils/rabbitmq.js";
import { ReservationService } from "../services/reservation.service.js";

export class ReservationConsumer {
  static async processReservation(message) {
    const { eventId, userId } = message;

    try {
      const reservation = await ReservationService.createReservation(eventId, userId);

      logger.info(
        `Reservation created for user ${userId} for event ${eventId}`
      );

        return reservation;
    } catch (error) {
      logger.error(
        `Error processing reservation for user ${userId} for event ${eventId}: ${error.message}`
      );

      throw new UnProcessableError(error.message);
    }
  }

  static async startConsuming() {
    try {
      await rabbitMQManager.consumeFromQueue(
        this.processReservation.bind(this)
      );
    } catch (error) {
      logger.error("Error consuming from RabbitMQ", error);
      throw new UnProcessableError("Error consuming from RabbitMQ", error);
    }
  }
}
