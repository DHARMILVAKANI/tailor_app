import * as winston from 'winston';
import * as dailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, json } = winston.format;

/**
 * It creates a logger used for information & error tracking
 */
export const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  exitOnError: false,
  transports: [
    new winston.transports.Console(),
    new dailyRotateFile({ filename: 'realbricks-backend', level: 'info' }),
  ],
  // to log unhandled errors
  exceptionHandlers: [
    new winston.transports.Console(),
    new dailyRotateFile({
      filename: 'realbricks-backend-error',
      level: 'error',
      format: winston.format.errors({ stack: true }),
    }),
  ],
});

/**
 * It is designed to log dwolla API call's request/response/error
 * @param message info or error message
 * @param data request/response/error payload
 * @param isError if the log-type is error
 */
export const dwollaLogger = (
  message: string,
  data: object,
  isError?: boolean,
) => {
  data = { ...data, thirdParty: 'dwolla' };
  const logLevel = isError ? 'error' : 'info';
  logger.log(logLevel, message, data);
};

/**
 * This function is used to log and track the third party API calls
 * @param message
 * @param data
 * @param thirdPartyPlatformName
 * @param isError
 */
export const thirdPartyLogger = (
  message: string,
  data: object,
  thirdPartyPlatformName: string,
  isError?: boolean,
) => {
  data = { ...data, thirdParty: thirdPartyPlatformName };
  const logLevel = isError ? 'error' : 'info';
  logger.log(logLevel, message, data);
};
