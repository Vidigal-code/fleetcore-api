import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'fleetcore:rate-limit';

export type RateLimitProfile = 'default' | 'auth';

export interface RateLimitOptions {
  /** Named budget resolved from configuration (no hardcoded limits). */
  readonly profile?: RateLimitProfile;
  /** Explicit override for critical endpoints, when needed. */
  readonly max?: number;
  readonly windowSeconds?: number;
}

/**
 * Selects a configured rate-limit budget for a route. Use the `auth` profile
 * on authentication endpoints (e.g. login) so they honour
 * RATE_LIMIT_AUTH_MAX_REQUESTS / RATE_LIMIT_AUTH_WINDOW_SECONDS.
 */
export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);

/** Convenience decorator for the stricter authentication budget. */
export const AuthRateLimit = () => RateLimit({ profile: 'auth' });
