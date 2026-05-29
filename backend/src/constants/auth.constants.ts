export const AUTH_CONSTANTS = {
  accessTokenCookieName: "biaslens_access_token",
  refreshTokenCookieName: "biaslens_refresh_token",
  accessTokenTtl: "15m",
  refreshTokenTtl: "7d",
  sessionTimeoutMs: 7 * 24 * 60 * 60 * 1000,
} as const;
