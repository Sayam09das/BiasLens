import { Router } from "express";

import { auditRoutes } from "./audit.routes.js";
import { healthRoutes } from "./health.routes.js";
import { authRoutes } from "./auth.routes.js";
import { reportRoutes } from "./report.routes.js";
import { uploadRoutes } from "./upload.routes.js";
import { userRoutes } from "./user.routes.js";
import { fairnessRoutes } from "../../modules/fairness/fairness.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", healthRoutes);
router.use("/", userRoutes);
router.use("/", auditRoutes);
router.use("/", uploadRoutes);
router.use("/", reportRoutes);
router.use("/", fairnessRoutes);

export { router as v1Routes };
