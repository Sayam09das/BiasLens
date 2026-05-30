import assert from "node:assert/strict";
import test from "node:test";

import { hashPassword, hashToken, verifyPassword } from "../../../src/utils/crypto.js";

test("hashPassword and verifyPassword validate a correct password", async () => {
  const hash = await hashPassword("StrongPass1!");

  assert.equal(await verifyPassword("StrongPass1!", hash), true);
  assert.equal(await verifyPassword("WrongPass1!", hash), false);
});

test("hashToken produces deterministic hashes", () => {
  const token = "sample-token";

  assert.equal(hashToken(token), hashToken(token));
  assert.notEqual(hashToken(token), hashToken("different-token"));
});
