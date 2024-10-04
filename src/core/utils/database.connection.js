import { sequelizeConn } from "../config/database.js";
import { logger } from "../loggers/logger.js";

export const initializeDbConnection = async () => {
  try {
    await sequelizeConn.authenticate();

    await sequelizeConn.sync({ alter: true });

    // await defaultAdmin();

    logger.info("Connection has been established successfully.");

    logger.info("All models were synchronized successfully.");
  } catch (error) {

    logger.error(`Unable to connect to the database: ${error.message}`);
    throw error;

  }
};
