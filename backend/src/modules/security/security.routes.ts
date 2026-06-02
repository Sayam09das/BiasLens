import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { securityScanController } from "./security.controller.js";


const router = Router();

// Start a scan. Streams are consumed from /security/scan/stream.
router.post("/security/scan", requireAuth, securityScanController.startScan);

// Note: SSE requires buffering disabled in some proxies; handled via headers.


// Real-time SSE stream of scan findings.
router.get(
  "/security/scan/stream",
  requireAuth,
  securityScanController.scanStream
);

export { router as securityRoutes };

