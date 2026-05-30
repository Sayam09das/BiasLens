import assert from "node:assert/strict";
import test from "node:test";

import { mlClientService } from "../../../src/services/ml-client.service.js";

test("mlClientService.getHealth calls the ML health endpoint", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (input: string | URL | Request) =>
    new Response(JSON.stringify({ status: "ok", path: String(input) }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })) as typeof fetch;

  try {
    const result = await mlClientService.getHealth();
    assert.equal((result as { status: string }).status, "ok");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
