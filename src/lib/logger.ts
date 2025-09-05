import * as Sentry from "@sentry/nextjs";

type LogMeta = Record<string, unknown>;

const shouldLog = () => {
  return (
    process.env.NEXT_PUBLIC_ENABLE_LOGS === "true" ||
    process.env.NODE_ENV === "development"
  );
};

export const log = {
  info: (message: string, meta?: LogMeta) => {
    if (shouldLog()) {
      console.log(`📝 ${message}`, meta);
    }
  },

  warn: (message: string, meta?: LogMeta) => {
    if (shouldLog()) {
      console.warn(`⚠️ ${message}`, meta);
    }
  },

  error: (message: string, meta?: LogMeta) => {
    console.error(`❌ ${message}`, meta);

    if (process.env.NODE_ENV === "production") {
      Sentry.captureMessage(`${message}`, {
        level: "error",
        extra: meta,
      });
    }
  },

  critical: (action: string, meta?: LogMeta) => {
    if (shouldLog()) {
      const metrics = {
        timestamp: new Date().toISOString(),
        memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        uptime: Math.round(process.uptime() / 60),
        ...meta,
      };
      console.log(`🔍 ACTION: ${action}`, metrics);
    }
  },

  always: (message: string, meta?: LogMeta) => {
    const data = {
      timestamp: new Date().toISOString(),
      ...meta,
    };
    console.log(`🚨 ${message}`, data);

    if (process.env.NODE_ENV === "production") {
      Sentry.addBreadcrumb({
        message: message,
        data: meta,
        level: "info",
      });
    }
  },

  exception: (error: Error, context?: string) => {
    console.error(`💥 EXCEPTION${context ? ` [${context}]` : ""}:`, error);

    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(error, {
        tags: { context },
        level: "error",
      });
    }
  },
};

export const isLoggingEnabled = shouldLog;
