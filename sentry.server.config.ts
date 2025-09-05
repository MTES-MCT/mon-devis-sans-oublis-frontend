// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENVIRONMENT =
  process.env.SENTRY_ENVIRONMENT ||
  process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ||
  process.env.APP_ENV ||
  process.env.NEXT_PUBLIC_APP_ENV ||
  process.env.NODE_ENV;

// Initialiser Sentry uniquement en production pour capturer les crashes
if (SENTRY_ENVIRONMENT === "production") {
  Sentry.init({
    dsn: SENTRY_DSN ?? "",
    environment: SENTRY_ENVIRONMENT,

    // Performance monitoring léger (10% des transactions)
    tracesSampleRate: 0.1,

    // Pas de debug en production
    debug: false,

    // Filtre pour logger seulement les erreurs critiques
    beforeSend(event, hint) {
      const isCritical =
        event.level === "error" ||
        event.level === "fatal" ||
        event.message?.toLowerCase().includes("heap") ||
        event.message?.toLowerCase().includes("memory") ||
        event.message?.toLowerCase().includes("server action") ||
        event.message?.toLowerCase().includes("killed") ||
        event.message?.toLowerCase().includes("sigterm") ||
        event.message?.toLowerCase().includes("crash");

      // Logger seulement les erreurs critiques
      if (isCritical) {
        console.error("🚨 CRITICAL ERROR DETECTED:", {
          message: event.message,
          level: event.level,
          timestamp: new Date().toISOString(),
          fingerprint: event.fingerprint,
        });
      }

      return event;
    },

    // Tags pour identifier facilement les erreurs dans Sentry
    initialScope: {
      tags: {
        component: "production-server",
        platform: "scalingo",
        version: process.env.npm_package_version || "unknown",
      },
    },
  });

  // Capturer le signal SIGTERM (quand Scalingo tue le processus)
  process.on("SIGTERM", () => {
    const crashInfo = {
      signal: "SIGTERM",
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime() / 60), // en minutes
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // en MB
    };

    console.error("🚨 PRODUCTION CRASH - SIGTERM:", crashInfo);
    Sentry.captureMessage("Production container received SIGTERM", {
      level: "fatal",
      extra: crashInfo,
    });
  });

  // Capturer les rejections de promesses non gérées
  process.on("unhandledRejection", (reason, promise) => {
    console.error("🚨 UNHANDLED REJECTION:", reason);
    Sentry.captureException(reason, {
      tags: { crash_type: "unhandled_rejection" },
    });
  });

  // Capturer les exceptions non gérées
  process.on("uncaughtException", (error) => {
    const crashInfo = {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime() / 60),
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    };

    console.error("🚨 UNCAUGHT EXCEPTION:", crashInfo);
    Sentry.captureException(error, {
      level: "fatal",
      extra: crashInfo,
      tags: { crash_type: "uncaught_exception" },
    });

    // Laisser le temps à Sentry d'envoyer l'erreur avant de quitter
    setTimeout(() => process.exit(1), 1000);
  });
}
