import assert from "node:assert/strict";
import test from "node:test";

import { auditQueue } from "../../src/queues/audit.queue.js";

test("audit workflow queue is available for end-to-end orchestration", () => {
  assert.equal(auditQueue.name, "audit.queue");
});
