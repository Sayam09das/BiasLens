import { Router } from "express";
import rateLimit from "express-rate-limit";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { authSchemas } from "./auth.schemas.js";
import {
  currentSessionController,
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  resendVerificationController,
  registerController,
  resetPasswordController,
  verifyEmailController,
} from "../../modules/auth/auth.controller.js";

const router = Router();
const authMutationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many sign-in attempts. Please wait before trying again.",
  },
});

router.get("/me", requireAuth, currentSessionController);
router.post("/login", loginRateLimit, validateRequest({ body: authSchemas.loginBody }), loginController);
router.post("/register", authMutationRateLimit, validateRequest({ body: authSchemas.registerBody }), registerController);
router.get("/verify-email", validateRequest({ query: authSchemas.verifyEmailQuery }), verifyEmailController);
router.post(
  "/resend-verification",
  authMutationRateLimit,
  validateRequest({ body: authSchemas.emailOnlyBody }),
  resendVerificationController
);
router.post("/refresh", authMutationRateLimit, validateRequest({ body: authSchemas.refreshBody }), refreshTokenController);
router.post(
  "/forgot-password",
  authMutationRateLimit,
  validateRequest({ body: authSchemas.emailOnlyBody }),
  forgotPasswordController
);
router.post(
  "/reset-password",
  authMutationRateLimit,
  validateRequest({ body: authSchemas.resetPasswordBody }),
  resetPasswordController
);
router.post("/logout", authMutationRateLimit, validateRequest({ body: authSchemas.logoutBody }), logoutController);

export { router as authRoutes };
