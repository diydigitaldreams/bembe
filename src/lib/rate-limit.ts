interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Use a global symbol so the store survives hot-reload in development
// but is still scoped to a single process. For multi-server deployments,
// swap this with a Redis-backed store.
const GLOBAL_KEY = Symbol.for("bembe.rateLimitStore");

function getStore(): Map<string, RateLimitEntry> {
  const g = globalThis as unknown as Record<symbol, Map<string, RateLimitEntry>>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = new Map();

    // Clean up expired entries every 60 seconds
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of g[GLOBAL_KEY]) {
        if (now >= entry.resetAt) {
          g[GLOBAL_KEY].delete(key);
        }
      }
    }, 60_000).unref?.();
  }
  return g[GLOBAL_KEY];
}

export function rateLimit(
  userId: string,
  { maxRequests = 10, windowMs = 60_000 } = {}
): { success: boolean; remaining: number } {
  const store = getStore();
  const now = Date.now();
  const key = userId;
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  entry.count++;

  if (entry.count > maxRequests) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: maxRequests - entry.count };
}
