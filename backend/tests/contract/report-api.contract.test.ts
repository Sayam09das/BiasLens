import assert from "node:assert/strict";
import test from "node:test";

import { reportParamsSchema } from "../../src/schemas/report.schema.js";

test("report API contract validates report id shape", () => {
  const parsed = reportParamsSchema.parse({ id: "682f2b3b6d6f6d6f6d6f6d81" });
  assert.equal(parsed.id.length, 24);
});
