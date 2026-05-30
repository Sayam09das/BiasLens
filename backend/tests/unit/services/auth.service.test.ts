import assert from "node:assert/strict";
import test from "node:test";

import { ValidationError } from "../../../src/utils/errors.js";
import { authService } from "../../../src/modules/auth/auth.service.js";

test("authService.register rejects weak passwords before persistence", async () => {
  const request = {
    protocol: "http",
    get: (header: string) => (header === "host" ? "localhost:4000" : null),
    ip: "::1",
    socket: { remoteAddress: "::1" },
  } as never;

  await assert.rejects(
    () =>
      authService.register(
        {
          fullName: "Test User",
          email: "test@example.com",
          password: "password123",
        },
        request
      ),
    (error: unknown) => error instanceof ValidationError
  );
});
