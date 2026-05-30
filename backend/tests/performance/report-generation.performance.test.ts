import assert from "node:assert/strict";
import test from "node:test";

import { reportQueue } from "../../src/queues/report.queue.js";

test("report queue can be referenced without heavy startup cost", () => {
  const startedAt = performance.now();
  assert.equal(reportQueue.name, "report.queue");
  assert.ok(performance.now() - startedAt < 50);
});
