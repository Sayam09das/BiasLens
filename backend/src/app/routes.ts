import type { Express } from "express";

import { apiRoutes } from "../routes/index.js";

export function registerRoutes(app: Express): void {
  app.get("/", (_req, res) => {
    res.json({
      service: "BiasLens Backend",
      status: "ready",
    });
  });

  app.use("/", apiRoutes);
}
