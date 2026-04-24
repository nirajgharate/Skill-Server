import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const CACHE_TTL_SECONDS = 120;

const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (error) => {
  console.error("Redis client error:", error.message || error);
});

redisClient.on("connect", () => {
  console.log("Redis client connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
};

export const getCachedValue = async (key) => {
  try {
    if (!redisClient.isOpen) await connectRedis();
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error("Redis getCachedValue error:", error.message || error);
    return null;
  }
};

export const setCachedValue = async (key, value, ttl = CACHE_TTL_SECONDS) => {
  try {
    if (!redisClient.isOpen) await connectRedis();
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  } catch (error) {
    console.error("Redis setCachedValue error:", error.message || error);
  }
};

export const deleteCacheByPattern = async (pattern) => {
  try {
    if (!redisClient.isOpen) await connectRedis();

    const keys = [];
    for await (const key of redisClient.scanIterator({ MATCH: pattern })) {
      keys.push(key);
    }

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error("Redis deleteCacheByPattern error:", error.message || error);
  }
};

export default redisClient;
