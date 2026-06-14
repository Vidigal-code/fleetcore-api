import { registerAs } from '@nestjs/config';

import type { RateLimitConfig } from './app-config.types';

const parseInteger = (value: string | undefined, fallback: number) => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export default registerAs(
  'rateLimit',
  (): RateLimitConfig => ({
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    windowSeconds: parseInteger(process.env.RATE_LIMIT_WINDOW_SECONDS, 60),
    maxRequests: parseInteger(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
    authWindowSeconds: parseInteger(
      process.env.RATE_LIMIT_AUTH_WINDOW_SECONDS,
      60,
    ),
    authMaxRequests: parseInteger(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS, 10),
  }),
);
