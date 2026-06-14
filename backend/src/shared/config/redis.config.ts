import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  ttlSeconds: parseInt(process.env.REDIS_TTL_SECONDS ?? '60', 10),
  lockTtlSeconds: parseInt(process.env.REDIS_LOCK_TTL ?? '30', 10),
}));
