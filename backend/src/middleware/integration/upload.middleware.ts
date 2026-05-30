import multer from "multer";
import type { NextFunction, Request, Response } from "express";

import { ValidationError } from "../../utils/errors.js";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
  },
});

export function virusScanMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
): void {
  if (!request.file) {
    next(new ValidationError("No file uploaded."));
    return;
  }

  // Placeholder for ClamAV or a managed scanning service integration.
  const fileName = request.file.originalname.toLowerCase();
  const blockedExtensions = [".exe", ".bat", ".cmd", ".sh", ".js"];

  if (blockedExtensions.some((extension) => fileName.endsWith(extension))) {
    next(new ValidationError("Uploaded file failed virus-scan policy checks."));
    return;
  }

  next();
}
