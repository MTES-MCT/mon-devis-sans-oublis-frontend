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

    // Enable automatic capture of console logs
    enableLogs: true,

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

// Monitoring automatique de la mémoire
if (ENABLE_MONITORING) {
  console.log(
    `🔍 MEMORY MONITORING ENABLED: interval=${MONITORING_INTERVAL / 60000}min`
  );

  setInterval(() => {
    // Lancer de façon asynchrone
    setImmediate(() => {
      try {
        const mem = process.memoryUsage();
        const heap = Math.round(mem.heapUsed / 1024 / 1024);
        const total = Math.round(mem.rss / 1024 / 1024);
        const up = Math.round(process.uptime() / 60);

        console.log(
          `📊 AUTO MEMORY CHECK: heap=${heap}MB total=${total}MB uptime=${up}min`
        );

        // Alertes simples seulement si critique
        if (heap > 200) {
          console.warn(`⚠️ HIGH MEMORY: ${heap}MB`);

          if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
            Sentry.captureMessage(`High memory usage: ${heap}MB`, "warning");
          }
        }
      } catch (error) {
        console.error("Memory check error:", error);
      }
    });
  }, MONITORING_INTERVAL);
}

/*
 * CRITICAL: npm automatic update checks correlation with crashes
 *
 * Analysis of production logs shows npm update notifications appear
 * immediately before container kills:
 * - 2025-09-07 22:48:30: "npm notice New major version available!"
 * - 2025-09-07 22:48:30: "Killed"
 *
 * Root cause: npm's automatic update checker runs asynchronously and
 * allocates memory for HTTP requests to registry.npmjs.org.
 * When container is near memory limit, this small allocation triggers
 * the final memory limit breach causing Scalingo to kill the process.
 *
 * Solution: NPM_CONFIG_UPDATE_NOTIFIER=false disables this check
 * References: https://docs.npmjs.com/cli/v7/using-npm/config#update-notifier
 */
