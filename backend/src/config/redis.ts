import { createClient, type RedisClientType } from "redis";

import { env } from "./env.js";
import { logger } from "./logger.js";

let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType | null> {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({ url: env.REDIS_URL });
    redisClient.on("error", (error) => {
      logger.error({ error }, "Redis client error");
    });
    await redisClient.connect();
  }

  return redisClient;
}

export async function getRedisHealth(): Promise<"connected" | "disconnected" | "disabled"> {
  if (!env.REDIS_URL) {
    return "disabled";
  }

  const client = await getRedisClient();
  return client?.isReady ? "connected" : "disconnected";
}
