import winston from "winston";
import path from "path";
import { Log } from "@src/api/schema/logger";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = path.join(__dirname, "../../logs");


const rotateTransport = new DailyRotateFile({
    filename: path.join(logDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    level: "warn",
    maxSize: "5m",
    maxFiles: "5",      // keep only the last 14 days
    zippedArchive: false, // We do not archive old files, we just delete them
});

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        rotateTransport,
        new winston.transports.Console({ format: winston.format.simple() })
    ],
});

export const loggerHttp = (l: any, api: string | null) => {
    const objError: Log = {
        status: l?.status ?? null,
        message: l?.message ?? null,
        data: l?.data ?? null,
        api,
    };

    logger.error(objError);
};