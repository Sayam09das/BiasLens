type CircuitState = "closed" | "open" | "half-open";

export class CircuitBreaker {
  private failures = 0;
  private state: CircuitState = "closed";
  private nextAttemptAt = 0;

  constructor(
    private readonly failureThreshold = 3,
    private readonly resetTimeoutMs = 10_000
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    const now = Date.now();

    if (this.state === "open" && now < this.nextAttemptAt) {
      throw new Error("Circuit breaker is open");
    }

    if (this.state === "open" && now >= this.nextAttemptAt) {
      this.state = "half-open";
    }

    try {
      const result = await operation();
      this.failures = 0;
      this.state = "closed";
      return result;
    } catch (error) {
      this.failures += 1;
      if (this.failures >= this.failureThreshold) {
        this.state = "open";
        this.nextAttemptAt = Date.now() + this.resetTimeoutMs;
      }
      throw error;
    }
  }
}
