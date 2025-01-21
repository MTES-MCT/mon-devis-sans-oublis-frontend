import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  transpilePackages: ['@gouvfr/dsfr'],
};

export default withSentryConfig(nextConfig, {
  automaticVercelMonitors: false,
  disableLogger: true,
  hideSourceMaps: true,
  org: process.env.NEXT_PUBLIC_SENTRY_ORG,
  project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
  sentryUrl: process.env.NEXT_PUBLIC_SENTRY_URL,
  silent: !process.env.CI,
  sourcemaps: {
    disable: true,
  },
  widenClientFileUpload: false,
});
