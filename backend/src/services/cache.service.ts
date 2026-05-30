import { getRedisClient } from "../config/redis.js";

export const cacheService = {
  async get(key: string): Promise<string | null> {
    const client = await getRedisClient();
    if (!client) {
      return null;
    }

    return client.get(key);
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const client = await getRedisClient();
    if (!client) {
      return;
    }

    if (ttlSeconds && ttlSeconds > 0) {
      await client.set(key, value, { EX: ttlSeconds });
      return;
    }

    await client.set(key, value);
  },

  async delete(key: string): Promise<void> {
    const client = await getRedisClient();
    if (!client) {
      return;
    }

    await client.del(key);
  },
};
