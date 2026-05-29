import type { Express } from "express";

import { healthRouter } from "./health.js";

export function registerRoutes(app: Express): void {
  app.get("/", (_req, res) => {
    res.json({
      service: "BiasLens Backend",
      status: "ready",
    });
  });

  app.use("/", healthRouter);
}
