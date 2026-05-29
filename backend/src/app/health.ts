import { Router } from "express";

import { getDatabaseHealth } from "../config/database.js";

const router = Router();

router.get("/health", (_req, res) => {
  const database = getDatabaseHealth();
  res.json({
    service: "BiasLens Backend",
    status: "ok",
    database: database.status,
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRouter };
