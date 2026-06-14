import { Injectable } from '@nestjs/common';

import { RedisService } from './redis.service';

const RATE_LIMIT_NAMESPACE = 'ratelimit';

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly limit: number;
  readonly remaining: number;
  readonly retryAfter: number;
}

@Injectable()
export class RateLimitService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Fixed-window counter. Increments the key and, on the first hit of a
   * window, sets its expiry. Returns whether the request is within the limit
   * plus the seconds until the window resets.
   */
  async consume(
    scope: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<RateLimitResult> {
    const client = this.redisService.getClient();
    const key = `${RATE_LIMIT_NAMESPACE}:${scope}`;

    const count = await client.incr(key);
    if (count === 1) {
      await client.expire(key, windowSeconds);
    }

    const ttl = await client.ttl(key);
    const retryAfter = ttl > 0 ? ttl : windowSeconds;

    return {
      allowed: count <= maxRequests,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - count),
      retryAfter,
    };
  }
}
