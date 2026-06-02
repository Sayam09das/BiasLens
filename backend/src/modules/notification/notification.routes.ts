import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { getNotificationSummaryController } from "./notification.controller.js";

const router = Router();

router.get("/notifications/summary", requireAuth, getNotificationSummaryController);

export { router as notificationRoutes };
