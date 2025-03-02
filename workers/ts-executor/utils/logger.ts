/*
This file contains a simple logger utility that can be used to log messages with different log levels.
The logger provides four log levels: info, warn, error, and debug.
The logger also provides a trace method that logs a stack trace.
The logger can be configured to include stack traces in the log output.
The logger can be configured to include the stack trace of the error object in the log output.

The logger utility provides the following methods:
- info: Logs an informational message.
- warn: Logs a warning message.
- error: Logs an error message.
- debug: Logs a debug message.
- trace: Logs a stack trace.

The logger utility provides the following options:
- includeStack: A boolean that determines whether to include a stack trace in the log
- stackDepth: A number that determines how many levels up in the stack to look
*/

type LogType = "info" | "warn" | "error" | "debug";

interface LogOptions {
  includeStack?: boolean;
  stackDepth?: number;
}

/**
 * Gets the caller details from the stack trace
 * @param stackDepth - How many levels up in the stack to look (default: 3)
 * @returns Formatted string with caller information
 */
const getCallerDetails = (stackDepth = 3): string => {
  const error = new Error();
  const stackLines = error.stack?.split("\n") || [];

  // Skip logger lines by finding the first non-logger line
  for (let i = 1; i < stackLines.length; i++) {
    const line = stackLines[i].trim();
    if (line.includes("logger.ts")) continue;

    const nodeMatch = line.match(/at (.+) \((.+):(\d+):(\d+)\)/);
    const simplMatch = line.match(/at (.+):(\d+):(\d+)/);

    if (nodeMatch) {
      const [, func, file, lineNum, col] = nodeMatch;
      const fileName = file.split("/").slice(-2).join("/");
      return `${fileName}:${lineNum}:${col}`;
    } else if (simplMatch) {
      const [, file, lineNum, col] = simplMatch;
      const fileName = file.split("/").slice(-2).join("/");
      return `${file}:${lineNum}:${col}`;
    }
  }

  return "unknown location";
};

/**
 * Extracts the actual error location from an Error object's stack trace
 * @param err - The error to get location from
 * @returns Original error location or null if not found
 */
const getErrorLocation = (err: Error): string | null => {
  if (!err.stack) return null;

  const stackLines = err.stack.split("\n");
  if (stackLines.length < 2) return null;

  // The first line with 'at' is usually where the error happened
  // Skip the first line which is the error message
  for (let i = 1; i < stackLines.length; i++) {
    const line = stackLines[i].trim();

    // Skip any lines that mention our logger file
    if (line.includes("logger.ts")) continue;

    const nodeMatch = line.match(/at (.+) \((.+):(\d+):(\d+)\)/);
    const simplMatch = line.match(/at (.+):(\d+):(\d+)/);

    if (nodeMatch) {
      const [, func, file, lineNum, col] = nodeMatch;
      const fileName = file.split("/").slice(-2).join("/");
      return `${func} (${fileName}:${lineNum}:${col})`;
    } else if (simplMatch) {
      const [, file, lineNum, col] = simplMatch;
      const fileName = file.split("/").slice(-2).join("/");
      return `${fileName}:${lineNum}:${col}`;
    }
  }

  return null;
};

/**
 * Formats any kind of error object to a string representation
 * @param err - The error to format (can be any type)
 * @returns String representation of the error
 */
const formatError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.stack || `${err.name}: ${err.message}`;
  } else if (typeof err === "string") {
    return err;
  } else if (err === null) {
    return "null";
  } else if (err === undefined) {
    return "undefined";
  } else if (typeof err === "object") {
    try {
      return JSON.stringify(err);
    } catch (e) {
      return `[Object: ${Object.prototype.toString.call(err)}]`;
    }
  }
  return String(err);
};

/**
 * Formats the log message for output, ensuring objects are stringified
 * @param message - The message to format
 * @returns The formatted message
 */
const formatLogMessage = (message: unknown): string => {
  if (typeof message === "object" && message !== null) {
    return JSON.stringify(message, null, 2); // Use JSON.stringify for objects
  } else {
    return String(message);
  }
};

/**
 * Log a message with the specified log level
 */
const logMessage = (
  type: LogType,
  message: unknown,
  options: LogOptions = {},
  ...optionalParams: unknown[]
) => {
  const { includeStack = false, stackDepth = 3 } = options;
  const timestamp = new Date().toISOString();

  // Get the original error location if this is an error
  let location =
    message instanceof Error && type === "error"
      ? getErrorLocation(message) || getCallerDetails()
      : getCallerDetails();

  if (type === "error" && message instanceof Error) {
    const errorLocation = getErrorLocation(message);
    if (errorLocation) {
      location = errorLocation;
    }
  }

  const logPrefix = `[${timestamp}] [${type.toUpperCase()}] ${location}:`;

  // Format message if it's an error or an object
  const formattedMessage =
    message instanceof Error ? formatError(message) : formatLogMessage(message);

  // Handle optional stack trace
  const stackInfo =
    includeStack && message instanceof Error ? `\n${message.stack || ""}` : "";

  switch (type) {
    case "info":
      console.log(logPrefix, formattedMessage, ...optionalParams, stackInfo);
      break;
    case "warn":
      console.warn(logPrefix, formattedMessage, ...optionalParams, stackInfo);
      break;
    case "error":
      console.error(logPrefix, formattedMessage, ...optionalParams, stackInfo);
      break;
    case "debug":
      console.debug(logPrefix, formattedMessage, ...optionalParams, stackInfo);
      break;
  }
};

export const logger = {
  /**
   * Log an informational message
   */
  info: (message: unknown, ...optionalParams: unknown[]) => {
    const options =
      optionalParams.length > 0 &&
      typeof optionalParams[0] === "object" &&
      optionalParams[0] !== null &&
      "includeStack" in optionalParams[0]
        ? (optionalParams.shift() as LogOptions)
        : {};
    logMessage("info", message, options, ...optionalParams);
  },

  /**
   * Log a warning message
   */
  warn: (message: unknown, ...optionalParams: unknown[]) => {
    const options =
      optionalParams.length > 0 &&
      typeof optionalParams[0] === "object" &&
      optionalParams[0] !== null &&
      "includeStack" in optionalParams[0]
        ? (optionalParams.shift() as LogOptions)
        : {};
    logMessage("warn", message, options, ...optionalParams);
  },

  /**
   * Log an error message
   */
  error: (message: unknown, ...optionalParams: unknown[]) => {
    const options =
      optionalParams.length > 0 &&
      typeof optionalParams[0] === "object" &&
      optionalParams[0] !== null &&
      "includeStack" in optionalParams[0]
        ? (optionalParams.shift() as LogOptions)
        : {};
    logMessage("error", message, options, ...optionalParams);
  },

  /**
   * Log a debug message
   */
  debug: (message: unknown, ...optionalParams: unknown[]) => {
    const options =
      optionalParams.length > 0 &&
      typeof optionalParams[0] === "object" &&
      optionalParams[0] !== null &&
      "includeStack" in optionalParams[0]
        ? (optionalParams.shift() as LogOptions)
        : {};
    logMessage("debug", message, options, ...optionalParams);
  },

  /**
   * Create a stack trace
   */
  trace: () => console.trace(`[TRACE] ${getCallerDetails()}`),
};
