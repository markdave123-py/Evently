import { createServer } from "http";
import { app } from "./app.service.js";
import { config } from "../core/config/env.js";
import { rabbitMQManager } from "../core/utils/rabbitmq.js";
import { ReservationConsumer } from "../reservation/consumers/reservation.consumer.js";
import { logger } from "../core/loggers/logger.js";

export const startApp = async () => {
  try {
    try {
      await rabbitMQManager.connect();
      logger.info("Connected to RabbitMQ");

      await ReservationConsumer.startConsuming();
    } catch (error) {
      logger.error(
        "RabbitMQ is not available, continuing without it. Will retry..."
      );
      rabbitMQManager.retryRabbitMQ();
    }
    const server = createServer(app);

    server.listen(config.port, () => console.log("server running"));
  } catch (error) {
    logger.error("Error starting the app", error);
    process.exit(1);
  }
};
