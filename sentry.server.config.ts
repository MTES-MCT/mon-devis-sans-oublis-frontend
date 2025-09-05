import * as Sentry from "@sentry/nextjs";

// Configuration ultra-légère, juste pour l'instrumentation de base
if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_SENTRY_DSN
) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // Configuration minimale pour éviter les fuites mémoire
    tracesSampleRate: 0.05, // Très faible
    debug: false,

    // Filtrage strict
    beforeSend(event) {
      // Ne garder que les erreurs critiques
      if (event.level === "fatal") {
        return event;
      }
      return null;
    },
  });
}
