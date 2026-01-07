/**
 * ロガー基盤
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

interface LogContext {
  error?: Error;
  [key: string]: unknown;
}

const MIN_LEVEL: LogLevel =
  process.env.NODE_ENV === "production" ? "info" : "debug";

const getConsoleMethod = (level: LogLevel): typeof console.log => {
  switch (level) {
    case "debug":
      return console.debug;
    case "info":
      return console.info;
    case "warn":
      return console.warn;
    case "error":
      return console.error;
  }
};

const log = (level: LogLevel, message: string, context?: LogContext): void => {
  if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[MIN_LEVEL]) {
    return;
  }

  const timeStr = new Date().toISOString();
  const prefix = `[${timeStr}] [${level.toUpperCase()}]`;
  const consoleMethod = getConsoleMethod(level);

  if (context?.error) {
    const { error, ...rest } = context;
    consoleMethod(prefix, message, error, rest);
  } else if (context && Object.keys(context).length > 0) {
    consoleMethod(prefix, message, context);
  } else {
    consoleMethod(prefix, message);
  }
};

export const logger = {
  debug: (message: string, context?: LogContext) =>
    log("debug", message, context),
  info: (message: string, context?: LogContext) =>
    log("info", message, context),
  warn: (message: string, context?: LogContext) =>
    log("warn", message, context),
  error: (message: string, context?: LogContext) =>
    log("error", message, context),
};
