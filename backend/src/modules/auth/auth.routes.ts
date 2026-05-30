import { Router } from "express";

import { validateRequest } from "../../middleware/validation.middleware.js";
import { authSchemas } from "./auth.schemas.js";
import {
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

router.post("/login", validateRequest({ body: authSchemas.loginBody }), loginController);
router.post("/register", validateRequest({ body: authSchemas.registerBody }), registerController);
router.get("/verify-email", validateRequest({ query: authSchemas.verifyEmailQuery }), verifyEmailController);
router.post(
  "/resend-verification",
  validateRequest({ body: authSchemas.emailOnlyBody }),
  resendVerificationController
);
router.post("/refresh", validateRequest({ body: authSchemas.refreshBody }), refreshTokenController);
router.post(
  "/forgot-password",
  validateRequest({ body: authSchemas.emailOnlyBody }),
  forgotPasswordController
);
router.post(
  "/reset-password",
  validateRequest({ body: authSchemas.resetPasswordBody }),
  resetPasswordController
);
router.post("/logout", validateRequest({ body: authSchemas.logoutBody }), logoutController);

export { router as authRoutes };
