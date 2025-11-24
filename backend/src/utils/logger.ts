/**
 * Structured Logging with Winston
 * 
 * Provides JSON-formatted logs for easy parsing by CloudWatch Insights, ELK, etc.
 * All logs include timestamp, level, message, and optional metadata.
 */

import winston from 'winston';
import { config } from './config';

/**
 * Create Winston logger instance
 * In Lambda, logs go to stdout → CloudWatch automatically
 */
const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }), // Include stack traces for errors
    winston.format.json() // JSON format for structured logging
  ),
  defaultMeta: {
    service: 'todo-api',
    environment: config.nodeEnv,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: config.nodeEnv === 'development' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          // Pretty print for local development, JSON for production
          if (config.nodeEnv === 'development') {
            return `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
          }
          return JSON.stringify({ timestamp, level, message, ...meta });
        })
      ),
    }),
  ],
});

/**
 * Log an info message
 */
export function logInfo(message: string, meta?: Record<string, unknown>): void {
  logger.info(message, meta);
}

/**
 * Log a warning message
 */
export function logWarn(message: string, meta?: Record<string, unknown>): void {
  logger.warn(message, meta);
}

/**
 * Log an error message with stack trace
 */
export function logError(message: string, error?: Error, meta?: Record<string, unknown>): void {
  logger.error(message, {
    ...meta,
    error: error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : undefined,
  });
}

/**
 * Log a debug message (only in development)
 */
export function logDebug(message: string, meta?: Record<string, unknown>): void {
  logger.debug(message, meta);
}

export default logger;
