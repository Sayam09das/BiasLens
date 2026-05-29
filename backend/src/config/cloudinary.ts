import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { env } from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "biaslens/resumes",
    resource_type: "raw",
    allowed_formats: ["pdf", "docx", "txt"],
  }),
});

export { cloudinary };
