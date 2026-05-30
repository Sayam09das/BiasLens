import assert from "node:assert/strict";
import test from "node:test";

import { mlClientService } from "../../src/services/ml-client.service.js";

test("ml client exposes the expected contract methods", () => {
  assert.equal(typeof mlClientService.getHealth, "function");
  assert.equal(typeof mlClientService.predict, "function");
  assert.equal(typeof mlClientService.explain, "function");
});
