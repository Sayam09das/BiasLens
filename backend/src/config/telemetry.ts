import { logger } from "./logger.js";

export function initializeTelemetry(): void {
  logger.debug("Telemetry initialization skipped in local development");
}
