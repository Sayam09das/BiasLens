import { Router } from "express";

import { auditRoutes } from "./audit.routes.js";
import { healthRoutes } from "./health.routes.js";
import { authRoutes } from "./auth.routes.js";
import { reportRoutes } from "./report.routes.js";
import { uploadRoutes } from "./upload.routes.js";
import { userRoutes } from "./user.routes.js";
import { fairnessRoutes } from "../../modules/fairness/fairness.routes.js";
import { explainabilityRoutes } from "../../modules/explainability/explainability.routes.js";
import { notificationRoutes } from "../../modules/notification/notification.routes.js";
import { securityRoutes } from "../../modules/security/security.routes.js";


const router = Router();

router.use("/auth", authRoutes);
router.use("/", healthRoutes);
router.use("/", userRoutes);
router.use("/", auditRoutes);
router.use("/", uploadRoutes);
router.use("/", reportRoutes);
router.use("/", fairnessRoutes);
router.use("/", explainabilityRoutes);
router.use("/", notificationRoutes);
router.use("/", securityRoutes);


export { router as v1Routes };
