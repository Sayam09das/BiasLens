import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";

import { featureFlags } from "../../config/feature-flags.js";
import { UploadedFileModel } from "../../models/uploaded-file.model.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/upload/resume", upload.single("file"), async (req, res, next) => {
  try {
    if (!featureFlags.enableFileUploads) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        message: "File uploads are disabled by feature flag.",
      });
    }

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "No file uploaded.",
      });
    }

    const savedFile = await UploadedFileModel.create({
      filename: `${Date.now()}-${req.file.originalname}`,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer,
      tags: ["resume", "atlas-storage"],
    });

    return res.status(StatusCodes.CREATED).json({
      id: savedFile.id,
      originalName: savedFile.originalName,
      size: savedFile.size,
      mimeType: savedFile.mimeType,
      storage: "mongodb-atlas",
      virusScan: "not_configured",
    });
  } catch (error) {
    return next(error);
  }
});

export { router as uploadRoutes };
