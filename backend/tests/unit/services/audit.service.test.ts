import assert from "node:assert/strict";
import test from "node:test";

import { auditService } from "../../../src/services/audit.service.js";

test("auditService.getStatuses exposes workflow states and transitions", () => {
  const statusSnapshot = auditService.getStatuses();

  assert.ok(statusSnapshot.statuses.QUEUED);
  assert.ok(Array.isArray(statusSnapshot.transitions.queued));
});
