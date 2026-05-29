export const PERFORMANCE_CONSTANTS = {
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMaxRequests: 300,
  redisDefaultTtlSeconds: 300,
  auditCacheTtlSeconds: 120,
  healthCacheTtlSeconds: 30,
} as const;
