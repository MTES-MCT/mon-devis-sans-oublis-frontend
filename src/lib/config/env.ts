import { z } from "zod";

const schema = z.object({
  // API
  NEXT_PUBLIC_API_AUTH: z.string().url(),
  NEXT_PUBLIC_API_QUOTE_CHECKS: z.string().url(),
  NEXT_PUBLIC_API_QUOTE_CHECKS_DELETE_ERROR_DETAIL_REASONS: z.string().url(),
  NEXT_PUBLIC_API_QUOTE_CHECKS_ID: z.string().url(),
  NEXT_PUBLIC_API_QUOTE_CHECKS_ID_ERROR_DETAILS_ID: z.string().url(),
  NEXT_PUBLIC_API_QUOTE_CHECKS_ID_FEEDBACKS: z.string().url(),
  NEXT_PUBLIC_API_QUOTE_CHECKS_ID_ERROR_DETAILS_ID_FEEDBACKS: z.string().url(),
  NEXT_PUBLIC_API_QUOTE_CHECKS_METADATA: z.string().url(),
  NEXT_PUBLIC_API_STATS: z.string().url(),

  // Matomo (optionnel)
  NEXT_PUBLIC_MATOMO_SITE_ID: z.string().optional(),
  NEXT_PUBLIC_MATOMO_URL: z.string().url().optional(),

  // Sentry (optionnel)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_ORG: z.string().optional(),
  NEXT_PUBLIC_SENTRY_PROJECT: z.string().optional(),
  NEXT_PUBLIC_SENTRY_URL: z.string().url().optional(),

  // Environnement
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables. Check .env.* files.");
}

export const ENV = parsed.data;
