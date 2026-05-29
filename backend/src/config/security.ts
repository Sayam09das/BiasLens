import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { AUTH_CONSTANTS } from "../constants/auth.constants.js";
import { PERFORMANCE_CONSTANTS } from "../constants/performance.constants.js";

export const securityMiddleware = {
  helmet: helmet(),
  cookies: cookieParser(),
  rateLimit: rateLimit({
    windowMs: PERFORMANCE_CONSTANTS.rateLimitWindowMs,
    max: PERFORMANCE_CONSTANTS.rateLimitMaxRequests,
    standardHeaders: true,
    legacyHeaders: false,
  }),
};

export const authConfig = {
  accessTokenCookieName: AUTH_CONSTANTS.accessTokenCookieName,
  refreshTokenCookieName: AUTH_CONSTANTS.refreshTokenCookieName,
  accessSecret: process.env.JWT_ACCESS_SECRET ?? "",
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? "",
  accessTokenTtl: AUTH_CONSTANTS.accessTokenTtl,
  refreshTokenTtl: AUTH_CONSTANTS.refreshTokenTtl,
};
