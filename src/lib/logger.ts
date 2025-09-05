export const log = {
  info: () => {},
  warn: () => {},
  error: (message: string, meta?: any) => {
    console.error(`❌ ${message}`, meta);
  },
  critical: () => {},
  always: (message: string, meta?: any) => {
    // Todo gérer scalingo + Sentry
    // TODO gérer via NEXT_PUBLIC_ENABLE_LOGS
    console.log(`🚨 ${message}`, meta);
  },
};
