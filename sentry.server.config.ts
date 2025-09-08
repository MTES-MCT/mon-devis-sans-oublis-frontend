import * as Sentry from "@sentry/nextjs";

// Configuration du monitoring via variables d'environnement
const ENABLE_MONITORING = process.env.ENABLE_MEMORY_MONITORING === "true";
const MONITORING_INTERVAL =
  parseInt(process.env.MEMORY_MONITORING_INTERVAL_MINUTES || "15") * 60 * 1000;

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
      const isCritical =
        event.level === "error" ||
        event.level === "fatal" ||
        event.message?.toLowerCase().includes("heap") ||
        event.message?.toLowerCase().includes("memory") ||
        event.message?.toLowerCase().includes("crash") ||
        event.message?.toLowerCase().includes("failed to parse") ||
        event.message?.toLowerCase().includes("formdata") ||
        event.message?.toLowerCase().includes("invalid url");

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

  // Process listeners existants
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

// Monitoring automatique
if (ENABLE_MONITORING) {
  console.log(
    `🔍 MEMORY MONITORING ENABLED: interval=${MONITORING_INTERVAL / 60000}min`
  );

  setInterval(() => {
    const memUsage = process.memoryUsage();
    const memory = Math.round(memUsage.heapUsed / 1024 / 1024);
    const totalMemory = Math.round(memUsage.rss / 1024 / 1024);
    const uptime = Math.round(process.uptime() / 60);

    // Log détaillé visible dans Scalingo
    console.log(
      `📊 AUTO MEMORY CHECK: heap=${memory}MB total=${totalMemory}MB uptime=${uptime}min`
    );

    // Alertes progressives (seulement en production avec Sentry)
    if (
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PUBLIC_SENTRY_DSN
    ) {
      if (memory > 150) {
        console.warn(`⚠️ MEMORY ALERT LEVEL 1: ${memory}MB after ${uptime}min`);
        Sentry.captureMessage(`Memory warning: ${memory}MB`, {
          level: "warning",
          extra: { memory, totalMemory, uptime, level: 1 },
        });
      }

      if (memory > 250) {
        console.error(
          `🚨 MEMORY ALERT LEVEL 2: ${memory}MB after ${uptime}min`
        );
        Sentry.captureMessage(`High memory usage: ${memory}MB`, {
          level: "error",
          extra: { memory, totalMemory, uptime, level: 2 },
        });
      }

      if (memory > 350) {
        console.error(
          `💀 MEMORY CRITICAL LEVEL 3: ${memory}MB after ${uptime}min - CRASH IMMINENT`
        );
        Sentry.captureMessage(`Critical memory usage: ${memory}MB`, {
          level: "fatal",
          extra: { memory, totalMemory, uptime, level: 3 },
        });
      }
    }
  }, MONITORING_INTERVAL);
}
