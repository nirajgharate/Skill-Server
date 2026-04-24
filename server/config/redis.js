// Redis caching is disabled because Redis is not required for server functionality.
// This module preserves the cache API used by controllers while avoiding Redis connection failures.

export const connectRedis = async () => {
  console.log("Redis caching disabled: skipping Redis connection.");
};

export const disconnectRedis = async () => {
  // No-op when Redis is disabled.
};

export const getCachedValue = async () => {
  return null;
};

export const setCachedValue = async () => {
  // No-op when Redis is disabled.
};

export const deleteCacheByPattern = async () => {
  // No-op when Redis is disabled.
};
