const cache = new Map();

const getCachedValue = (key) => {
  const item = cache.get(key);

  if (!item) {
    return null;
  }

  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }

  return item.value;
};

const setCachedValue = (key, value, ttlMs = 30000) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
};

const clearCache = () => {
  cache.clear();
};

module.exports = {
  getCachedValue,
  setCachedValue,
  clearCache
};