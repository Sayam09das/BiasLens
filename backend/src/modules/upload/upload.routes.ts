import { Router } from "express";

import { uploadResumeController } from "../../controllers/upload.controller.js";
import {
  uploadMiddleware,
  virusScanMiddleware,
} from "../../middleware/integration/upload.middleware.js";

const router = Router();

router.post("/upload/resume", uploadMiddleware.single("file"), virusScanMiddleware, (req, res, next) => {
  uploadResumeController(req, res).catch(next);
});

export { router as uploadRoutes };
