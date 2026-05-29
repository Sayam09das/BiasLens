import mongoose from "mongoose";

import { env } from "./env.js";
import { logger } from "./logger.js";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDatabase(): Promise<typeof mongoose> {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== "production",
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
    });
  }

  const connection = await connectionPromise;
  logger.info("MongoDB connected successfully");
  return connection;
}

export function getDatabaseHealth() {
  return {
    state: mongoose.connection.readyState,
    status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };
}
