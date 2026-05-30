import { securityMiddleware } from "../../config/security.js";

export const rateLimitMiddleware = securityMiddleware.rateLimit;
