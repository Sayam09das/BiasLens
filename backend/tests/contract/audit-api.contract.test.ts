import assert from "node:assert/strict";
import test from "node:test";

import { auditSchemas } from "../../src/modules/audit/audit.schemas.js";

test("audit API query contract accepts standard pagination input", () => {
  const parsed = auditSchemas.auditLogListQuery.parse({ page: "1", limit: "10" });

  assert.equal(parsed.page, 1);
  assert.equal(parsed.limit, 10);
});
