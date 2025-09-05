import * as Sentry from "@sentry/nextjs";

if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_SENTRY_DSN
) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    tracesSampleRate: 0.05,
    debug: false,

    beforeSend(event) {
      // Erreurs importantes + crashes système
      const isCritical =
        event.level === "error" ||
        event.level === "fatal" ||
        event.message?.toLowerCase().includes("heap") ||
        event.message?.toLowerCase().includes("memory") ||
        event.message?.toLowerCase().includes("crash");

      if (isCritical) {
        console.error("🚨 SENTRY CAPTURE:", {
          message: event.message,
          level: event.level,
          timestamp: new Date().toISOString(),
        });
        return event;
      }
      return null;
    },
  });

  // Ajoutez les process.on() pour capturer SIGTERM etc.
  process.on("SIGTERM", () => {
    const crashInfo = {
      signal: "SIGTERM",
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime() / 60),
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    };

    console.error("🚨 PRODUCTION CRASH - SIGTERM:", crashInfo);
    Sentry.captureMessage("Production container received SIGTERM", {
      level: "fatal",
      extra: crashInfo,
    });
  });
}
