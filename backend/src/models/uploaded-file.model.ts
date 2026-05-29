import mongoose from "mongoose";

const uploadedFileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    buffer: { type: Buffer, required: true },
    uploadedBy: { type: String, default: null },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: "uploaded_files",
  }
);

export const UploadedFileModel =
  mongoose.models.UploadedFile || mongoose.model("UploadedFile", uploadedFileSchema);
