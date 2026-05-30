import { Router } from "express";
import multer from "multer";

import { uploadResumeController } from "../../controllers/upload.controller.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/upload/resume", upload.single("file"), (req, res, next) => {
  uploadResumeController(req, res).catch(next);
});

export { router as uploadRoutes };
