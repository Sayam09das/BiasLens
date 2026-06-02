export const AUTH_CONSTANTS = {
  accessTokenCookieName: "biaslens_access_token",
  refreshTokenCookieName: "biaslens_refresh_token",
  accessTokenTtl: "15m",
  refreshTokenTtl: "7d",
  rememberMeRefreshTokenTtl: "30d",
  accessTokenMaxAgeMs: 15 * 60 * 1000,
  refreshTokenMaxAgeMs: 7 * 24 * 60 * 60 * 1000,
  rememberMeRefreshTokenMaxAgeMs: 30 * 24 * 60 * 60 * 1000,
  sessionTimeoutMs: 7 * 24 * 60 * 60 * 1000,
  rememberMeSessionTimeoutMs: 30 * 24 * 60 * 60 * 1000,
  emailVerificationTtlMs: 24 * 60 * 60 * 1000,
  passwordResetTtlMs: 60 * 60 * 1000,
} as const;
