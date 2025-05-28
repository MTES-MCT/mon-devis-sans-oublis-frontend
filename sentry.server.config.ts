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

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: SENTRY_DSN ?? "",
    environment: SENTRY_ENVIRONMENT,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}
