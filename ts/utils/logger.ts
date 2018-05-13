import {Logger, LoggerInstance, transports} from "winston";

if (!process.env.ACCESS_LOG || !process.env.ERROR_LOG) {
  throw new Error("[-]You have to define log files in .env file");
}
export const logger: LoggerInstance = new (Logger)({
  transports: [
    new (transports.Console)({timestamp: true}),
    new (transports.File)({
      filename: process.env.ACCESS_LOG,
      level: "info",
      name: "info-file",
    }),
    new (transports.File)({
      filename: process.env.ERROR_LOG,
      level: "error",
      name: "error-file",
    }),
  ],
});
