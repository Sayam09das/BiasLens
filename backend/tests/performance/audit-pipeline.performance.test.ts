import assert from "node:assert/strict";
import test from "node:test";

import { auditService } from "../../src/services/audit.service.js";

test("audit pipeline status snapshot resolves quickly for lightweight checks", () => {
  const startedAt = performance.now();
  const snapshot = auditService.getStatuses();
  const durationMs = performance.now() - startedAt;

  assert.ok(snapshot.statuses);
  assert.ok(durationMs < 50);
});
