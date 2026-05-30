import assert from "node:assert/strict";
import test from "node:test";

import { reportService } from "../../src/services/report.service.js";

test("report service exposes report retrieval methods for integration wiring", () => {
  assert.equal(typeof reportService.getReportById, "function");
  assert.equal(typeof reportService.downloadReport, "function");
});
