import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

export const securityMiddleware = {
  helmet: helmet(),
  cookies: cookieParser(),
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
};

export const authConfig = {
  accessTokenCookieName: "biaslens_access_token",
  refreshTokenCookieName: "biaslens_refresh_token",
  accessSecret: process.env.JWT_ACCESS_SECRET ?? "",
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? "",
};
