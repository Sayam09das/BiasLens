import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";

import { createApp } from "../../src/app/app.js";

test("POST /v1/upload/resume without a file returns validation error", async (t) => {
  const app = createApp();
  const server = createServer(app);

  try {
    await new Promise<void>((resolve, reject) => {
      const onError = (error: Error) => {
        server.off("listening", onListening);
        reject(error);
      };

      const onListening = () => {
        server.off("error", onError);
        resolve();
      };

      server.once("error", onError);
      server.once("listening", onListening);
      server.listen(0, "127.0.0.1");
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EPERM") {
      t.skip("Local port binding is not permitted in this environment.");
      return;
    }

    throw error;
  }

  try {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Server address unavailable");
    }

    const formData = new FormData();
    const response = await fetch(`http://127.0.0.1:${address.port}/v1/upload/resume`, {
      method: "POST",
      body: formData,
    });

    assert.equal(response.status, 400);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});
