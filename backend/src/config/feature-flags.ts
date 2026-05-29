import { env } from "./env.js";

export const featureFlags = {
  enableEmail: env.FEATURE_ENABLE_EMAIL,
  enableCloudinaryUploads: env.FEATURE_ENABLE_CLOUDINARY_UPLOADS,
  enableRedisCache: Boolean(env.REDIS_URL),
};
