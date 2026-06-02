import type { Express } from "express";

import { apiRoutes } from "../routes/index.js";
import { healthRoutes } from "../routes/v1/health.routes.js";

export function registerRoutes(app: Express): void {
  app.get("/", (_req, res) => {
    res.json({
      service: "BiasLens Backend",
      status: "ready",
    });
  });

  app.use("/", healthRoutes);
  // Mount versioned API under the same root so client can call /v1/*
  app.use("/", apiRoutes);
}

