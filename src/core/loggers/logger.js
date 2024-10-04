import { createLogger, transports, format } from "winston";
const { combine, printf, timestamp, colorize } = format;

function logFormat() {
  return printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.stack || info.message}`;
  });
}

export function buildDevLogger() {
  return createLogger({
    format: combine(colorize(), timestamp(), logFormat()),
    transports: [
      new transports.Console(),

      new transports.File({
        filename: "logs/info.log",
        level: "info",
        handleExceptions: true,
        format: combine(
          timestamp(),
          logFormat()
        ),
      }),


      new transports.File({
        filename: "logs/error.log",
        level: "error",
        handleExceptions: true,
        format: combine(
          timestamp(),
          logFormat() 
        ),
      }),
    ],
  });
}


export const logger = buildDevLogger();
