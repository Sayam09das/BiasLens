import { env } from "./env.js";

export const featureFlags = {
  enableEmail: env.FEATURE_ENABLE_EMAIL,
  enableFileUploads: env.FEATURE_ENABLE_FILE_UPLOADS,
  enableRedisCache: Boolean(env.REDIS_URL),
};
