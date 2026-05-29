import { Router } from "express";

import { getDatabaseHealth } from "../../config/database.js";
import { getRedisHealth } from "../../config/redis.js";

const router = Router();

router.get("/health", async (_req, res) => {
  const database = getDatabaseHealth();
  const redis = await getRedisHealth();

  res.json({
    service: "BiasLens Backend",
    version: "v1",
    status: "ok",
    database: database.status,
    redis,
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRoutes };
