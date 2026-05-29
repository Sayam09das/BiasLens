import { Router } from "express";

import { getDatabaseHealth } from "../../config/database.js";
import { getRedisHealth } from "../../config/redis.js";
import { successResponse } from "../../utils/api-response.js";
import { nowIso } from "../../utils/date.js";

const router = Router();

router.get("/health", async (_req, res) => {
  const database = getDatabaseHealth();
  const redis = await getRedisHealth();

  res.json(
    successResponse({
      service: "BiasLens Backend",
      version: "v1",
      status: "ok",
      database: database.status,
      redis,
      timestamp: nowIso(),
    })
  );
});

export { router as healthRoutes };
