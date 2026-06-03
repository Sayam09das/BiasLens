export const sentryClientConfig = {
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",
  environment: process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? "development",
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0"),
};
