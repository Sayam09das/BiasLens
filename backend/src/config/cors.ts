import cors, { type CorsOptions } from "cors";

import { env } from "./env.js";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://bias-lens-omega.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

function getAllowedOrigins() {
  const configured = env.CLIENT_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured]);
}

function isAllowedOrigin(origin: string) {
  const allowedOrigins = getAllowedOrigins();
  if (allowedOrigins.has(origin)) {
    return true;
  }

  // Allow Vercel preview deployments for this project.
  return /^https:\/\/bias-lens-[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
