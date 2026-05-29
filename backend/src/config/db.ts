import mongoose from "mongoose";

import { env } from "./env.js";
import { logger } from "../lib/logger.js";

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production",
  });
  logger.info("MongoDB connected successfully");
}
