import { UploadedFileModel } from "../models/uploaded-file.model.js";
import { isAllowedResumeMimeType, isWithinFileSizeLimit } from "../utils/file.js";
import { ValidationError } from "../utils/errors.js";

type SaveResumeUploadInput = {
  file: Express.Multer.File | undefined;
  uploadedBy?: string | null;
};

export const storageService = {
  async saveResumeUpload(input: SaveResumeUploadInput) {
    const file = input.file;

    if (!file) {
      throw new ValidationError("No file uploaded.");
    }

    if (!isAllowedResumeMimeType(file.mimetype)) {
      throw new ValidationError("Unsupported resume file type.", {
        mimeType: file.mimetype,
      });
    }

    if (!isWithinFileSizeLimit(file.size)) {
      throw new ValidationError("Uploaded file exceeds the allowed size limit.", {
        size: file.size,
      });
    }

    const savedFile = await UploadedFileModel.create({
      filename: `${Date.now()}-${file.originalname}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      buffer: file.buffer,
      uploadedBy: input.uploadedBy ?? null,
      tags: ["resume", "atlas-storage"],
    });

    return {
      id: savedFile.id,
      originalName: savedFile.originalName,
      size: savedFile.size,
      mimeType: savedFile.mimeType,
      storage: "mongodb-atlas",
      virusScan: "not_configured",
    };
  },
};
