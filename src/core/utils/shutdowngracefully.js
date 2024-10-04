import { logger } from "../loggers/logger.js";
import { rabbitMQManager } from "./rabbitmq.js";

export const gracefullyShutdown = async (error) => {
  try {
    logger.error("UNEXPECTED_APP_ERROR", error);

    await rabbitMQManager.close();
    logger.info("RabbitMQ connection closed successfully.");

    process.exit(1);
  } catch (error) {
    logger.error("Error shutting down the app", error);
    process.exit(1);
  }
};
