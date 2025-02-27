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

  // Format message if it's an error
  const formattedMessage =
    message instanceof Error ? formatError(message) : message;

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
