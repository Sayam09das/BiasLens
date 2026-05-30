import assert from "node:assert/strict";
import test from "node:test";

import { reportQueue } from "../../src/queues/report.queue.js";

test("report generation queue is available for end-to-end orchestration", () => {
  assert.equal(reportQueue.name, "report.queue");
});
