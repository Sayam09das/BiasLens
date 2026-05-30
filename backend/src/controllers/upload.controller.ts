import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { featureFlagService } from "../services/feature-flag.service.js";
import { storageService } from "../services/storage.service.js";
import { successResponse } from "../utils/api-response.js";

export async function uploadResumeController(
  request: Request,
  response: Response
): Promise<void> {
  if (!featureFlagService.isEnabled("enableFileUploads")) {
    response.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      message: "File uploads are disabled by feature flag.",
    });
    return;
  }

  const savedFile = await storageService.saveResumeUpload({
    file: request.file,
    uploadedBy: null,
  });

  response
    .status(StatusCodes.CREATED)
    .json(successResponse(savedFile, "Resume uploaded successfully"));
}
