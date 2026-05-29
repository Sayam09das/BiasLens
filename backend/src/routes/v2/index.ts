import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    version: "v2",
    status: "reserved",
    message: "API v2 is reserved for future backward-compatible expansion.",
  });
});

export { router as v2Routes };
