import express from "express";

import { registerMiddleware } from "../middleware/index.js";
import { errorHandler, notFoundHandler } from "../middleware/validation/error.middleware.js";
import { registerRoutes } from "./routes.js";

export function createApp() {
  const app = express();

  registerMiddleware(app);

  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
