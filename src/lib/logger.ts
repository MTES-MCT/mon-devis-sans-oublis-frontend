// src/lib/logger.ts
import { Sentry } from "@/lib/sentry";

// Configuration des logs basée sur les variables d'environnement
const shouldLog = () => {
  return (
    process.env.NEXT_PUBLIC_ENABLE_LOGS === "true" ||
    process.env.NODE_ENV === "development"
  );
};

// Logger intelligent avec Sentry externe
export const log = {
  // Logs d'info seulement si activés → Scalingo uniquement
  info: (message: string, meta?: any) => {
    if (shouldLog()) {
      console.log(`📝 ${message}`, meta);
    }
  },

  // Warnings seulement si activés → Scalingo uniquement
  warn: (message: string, meta?: any) => {
    if (shouldLog()) {
      console.warn(`⚠️ ${message}`, meta);
    }
  },

  // Erreurs → Scalingo + Sentry
  error: (message: string, meta?: any) => {
    console.error(`❌ ${message}`, meta); // → Logs Scalingo

    if (process.env.NODE_ENV === "production") {
      Sentry.captureMessage(`${message}`, {
        level: "error",
        extra: meta,
      }); // → Sentry
    }
  },

  // Actions critiques avec métriques → Scalingo uniquement
  critical: (action: string, meta?: any) => {
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

  // Debug seulement en dev → Scalingo uniquement
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === "development" || shouldLog()) {
      console.debug(`🐛 ${message}`, meta);
    }
  },

  // Logs critiques → Scalingo + Sentry breadcrumb
  always: (message: string, meta?: any) => {
    const data = {
      timestamp: new Date().toISOString(),
      ...meta,
    };
    console.log(`🚨 ${message}`, data); // → Logs Scalingo

    if (process.env.NODE_ENV === "production") {
      Sentry.addBreadcrumb({
        message: message,
        data: meta,
        level: "info",
      }); // → Sentry breadcrumb
    }
  },

  // Exception avec stack trace → Scalingo + Sentry
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

// Helper pour vérifier si les logs sont activés
export const isLoggingEnabled = shouldLog;
