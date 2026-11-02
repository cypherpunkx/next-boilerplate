export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

export interface LoggerTransport {
  log(level: LogLevel, message: string, context?: LogContext): void;
}

function formatContext(context?: LogContext): unknown {
  if (!context) return undefined;
  const cleanContext: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    if (value instanceof Error) {
      cleanContext[key] = {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    } else {
      cleanContext[key] = value;
    }
  }
  return cleanContext;
}

class ConsoleTransport implements LoggerTransport {
  log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    const formattedContext = context ? formatContext(context) : undefined;

    switch (level) {
      case "debug":
        if (process.env.NODE_ENV !== "production") {
          if (formattedContext !== undefined) {
            console.debug(formatted, formattedContext);
          } else {
            console.debug(formatted);
          }
        }
        break;
      case "info":
        if (formattedContext !== undefined) {
          console.info(formatted, formattedContext);
        } else {
          console.info(formatted);
        }
        break;
      case "warn":
        if (formattedContext !== undefined) {
          console.warn(formatted, formattedContext);
        } else {
          console.warn(formatted);
        }
        break;
      case "error":
        if (formattedContext !== undefined) {
          console.error(formatted, formattedContext);
        } else {
          console.error(formatted);
        }
        break;
    }
  }
}

class StructuredLogger {
  private transports: LoggerTransport[] = [new ConsoleTransport()];

  public addTransport(transport: LoggerTransport): void {
    this.transports.push(transport);
  }

  public debug(message: string, context?: LogContext): void {
    this.dispatch("debug", message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.dispatch("info", message, context);
  }

  public warn(message: string, context?: LogContext): void {
    this.dispatch("warn", message, context);
  }

  public error(message: string, context?: LogContext): void {
    this.dispatch("error", message, context);
  }

  private dispatch(level: LogLevel, message: string, context?: LogContext): void {
    for (const transport of this.transports) {
      try {
        transport.log(level, message, context);
      } catch (err) {
        console.error("Logger transport failed:", err);
      }
    }
  }
}

export const logger = new StructuredLogger();
