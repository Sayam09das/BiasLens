import { Router } from "express";

import { auditRoutes } from "../../modules/audit/audit.routes.js";
import { healthRoutes } from "./health.routes.js";
import { authRoutes } from "../../modules/auth/auth.routes.js";
import { reportRoutes } from "../../modules/report/report.routes.js";
import { uploadRoutes } from "../../modules/upload/upload.routes.js";
import { userRoutes } from "../../modules/user/user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/", healthRoutes);
router.use("/", userRoutes);
router.use("/", auditRoutes);
router.use("/", uploadRoutes);
router.use("/", reportRoutes);

export { router as v1Routes };
