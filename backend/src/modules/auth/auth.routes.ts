import { Router } from "express";

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

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/verify-email", verifyEmailController);
router.post("/resend-verification", resendVerificationController);
router.post("/refresh", refreshTokenController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/logout", logoutController);

export { router as authRoutes };
