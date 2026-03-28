import { NextRequest, NextResponse } from "next/server";

type RateLimitEntry = {
  timestamps: number[];
};

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((ts) => ts > cutoff);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

function getClientIp(request: NextRequest): string {
  // Check common proxy headers
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  // Fallback — in production behind a proxy this should not happen
  return "unknown";
}

type RateLimitConfig = {
  /** Maximum number of requests allowed within the window. */
  limit: number;
  /** Time window in milliseconds. */
  windowMs: number;
};

const DEFAULT_CONFIG: RateLimitConfig = {
  limit: 10,
  windowMs: 60 * 1000, // 1 minute
};

/**
 * Check rate limit for the current request.
 * Returns null if the request is allowed, or a 429 NextResponse if rate-limited.
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = DEFAULT_CONFIG,
): NextResponse | null {
  const { limit, windowMs } = config;
  const ip = getClientIp(request);
  const now = Date.now();
  const cutoff = now - windowMs;

  // Periodic cleanup
  cleanup(windowMs);

  let entry = store.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(ip, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((ts) => ts > cutoff);

  if (entry.timestamps.length >= limit) {
    const retryAfterSeconds = Math.ceil(
      (entry.timestamps[0] + windowMs - now) / 1000,
    );
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
        },
      },
    );
  }

  entry.timestamps.push(now);
  return null;
}
