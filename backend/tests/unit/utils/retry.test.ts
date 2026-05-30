import assert from "node:assert/strict";
import test from "node:test";

import { withRetry } from "../../../src/utils/retry.js";

test("withRetry retries until success", async () => {
  let attempts = 0;

  const result = await withRetry(
    async () => {
      attempts += 1;

      if (attempts < 3) {
        throw new Error("temporary failure");
      }

      return "ok";
    },
    { retries: 3, baseDelayMs: 1 }
  );

  assert.equal(result, "ok");
  assert.equal(attempts, 3);
});
