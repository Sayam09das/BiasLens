import { logger } from "../config/logger.js";

export type QueuePriority = "low" | "normal" | "high";

export type QueueOptions = {
  priority?: QueuePriority;
};

export type QueueHandler<TPayload, TResult = unknown> = (payload: TPayload) => Promise<TResult>;

export type AppQueue<TPayload, TResult = unknown> = {
  name: string;
  add: (payload: TPayload, options?: QueueOptions) => Promise<TResult>;
};

export function createQueue<TPayload, TResult = unknown>(
  name: string,
  handler: QueueHandler<TPayload, TResult>
): AppQueue<TPayload, TResult> {
  return {
    name,
    async add(payload: TPayload, options?: QueueOptions): Promise<TResult> {
      logger.info({ queue: name, priority: options?.priority ?? "normal" }, "Queue job enqueued");
      return handler(payload);
    },
  };
}
