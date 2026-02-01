// Rate Limiter using Token Bucket Algorithm
// In a production environment, this would use Redis for distributed state.

interface Bucket {
    tokens: number;
    lastRefill: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitConfig {
    requestsPerMinute: number;
    tokensPerHour: number;
}

export async function checkRateLimit(
    key: string,
    config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number }> {
    const now = Date.now();
    let bucket = buckets.get(key);

    const refillRate = config.requestsPerMinute / 60000; // tokens per ms
    const capacity = config.requestsPerMinute;

    if (!bucket) {
        bucket = { tokens: capacity, lastRefill: now };
    } else {
        // Refill tokens based on time passed
        const delta = now - bucket.lastRefill;
        const refill = delta * refillRate;
        bucket.tokens = Math.min(capacity, bucket.tokens + refill);
        bucket.lastRefill = now;
    }

    if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        buckets.set(key, bucket);
        return { allowed: true, remaining: Math.floor(bucket.tokens) };
    }

    return { allowed: false, remaining: 0 };
}
