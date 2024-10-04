import { createClient } from "redis";
import { config } from "../config/env.js";
import { logger } from "../loggers/logger.js";

export const redisClient = createClient({
  url: config.redis.url || "redis://localhost:6379",
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

redisClient.on("error", (error) => {
  logger.error("Error connecting to Redis", error);
});


await redisClient.connect();
