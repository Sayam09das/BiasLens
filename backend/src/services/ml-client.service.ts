import { withRetry } from "../utils/retry.js";
import { CircuitBreaker } from "../utils/circuit-breaker.js";

const breaker = new CircuitBreaker();
const defaultMlServiceBaseUrl = process.env.ML_SERVICE_URL?.trim() || "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  return breaker.execute(async () =>
    withRetry(async () => {
      const response = await fetch(`${defaultMlServiceBaseUrl}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
      });

      if (!response.ok) {
        throw new Error(`ML service request failed with status ${response.status}`);
      }

      return (await response.json()) as T;
    })
  );
}

export const mlClientService = {
  getHealth() {
    return request("/health");
  },

  predict(payload: Record<string, unknown>) {
    return request("/predict", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  explain(payload: Record<string, unknown>) {
    return request("/explain", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
