import { startApp } from "./app/app.module.js";
import { gracefullyShutdown } from "./core/utils/shutdowngracefully.js";
import { initializeDbConnection } from "./core/utils/database.connection.js";
import { logger } from "./core/loggers/logger.js";

initializeDbConnection().then(startApp).catch(gracefullyShutdown);

process.on("uncaughtException", (error) => {
  logger.info("Uncaught exception", error);
  process.exit(1);
});


process.on("unhandledRejection", (error) => {
  logger.info("Unhandled rejection", error);
  process.exit(1);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  gracefullyShutdown();
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  gracefullyShutdown();
});
