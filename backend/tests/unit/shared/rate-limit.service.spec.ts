import { RateLimitService } from '../../../src/shared/cache/rate-limit.service';
import type { RedisService } from '../../../src/shared/cache/redis.service';

describe('RateLimitService', () => {
  let counters: Map<string, number>;
  let client: { incr: jest.Mock; expire: jest.Mock; ttl: jest.Mock };
  let redis: jest.Mocked<RedisService>;
  let service: RateLimitService;

  beforeEach(() => {
    counters = new Map();
    client = {
      incr: jest.fn((key: string) => {
        const next = (counters.get(key) ?? 0) + 1;
        counters.set(key, next);
        return Promise.resolve(next);
      }),
      expire: jest.fn().mockResolvedValue(1),
      ttl: jest.fn().mockResolvedValue(60),
    };

    redis = {
      getClient: jest.fn(() => client),
    } as unknown as jest.Mocked<RedisService>;

    service = new RateLimitService(redis);
  });

  it('allows requests up to the limit and blocks beyond it', async () => {
    const first = await service.consume('ip:1:endpoint:GET:/x', 2, 60);
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(1);

    const second = await service.consume('ip:1:endpoint:GET:/x', 2, 60);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(0);

    const third = await service.consume('ip:1:endpoint:GET:/x', 2, 60);
    expect(third.allowed).toBe(false);
    expect(third.retryAfter).toBe(60);
  });

  it('sets the window expiry only on the first hit', async () => {
    await service.consume('ip:1:endpoint:GET:/x', 5, 60);
    await service.consume('ip:1:endpoint:GET:/x', 5, 60);

    expect(client.expire).toHaveBeenCalledTimes(1);
  });
});
