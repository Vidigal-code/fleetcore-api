import { IdempotencyService } from '../../../src/shared/cache/idempotency.service';
import type { RedisService } from '../../../src/shared/cache/redis.service';
import type { AppConfigService } from '../../../src/shared/config/app-config.service';

describe('IdempotencyService', () => {
  let store: Map<string, string>;
  let client: { set: jest.Mock; exists: jest.Mock };
  let redis: jest.Mocked<RedisService>;
  let service: IdempotencyService;

  beforeEach(() => {
    store = new Map();
    client = {
      // Emulates SET key value NX EX ttl
      set: jest.fn((key: string, value: string) => {
        if (store.has(key)) {
          return Promise.resolve(null);
        }
        store.set(key, value);
        return Promise.resolve('OK');
      }),
      exists: jest.fn((key: string) => Promise.resolve(store.has(key) ? 1 : 0)),
    };

    redis = {
      getClient: jest.fn(() => client),
      delete: jest.fn((key: string) => {
        store.delete(key);
        return Promise.resolve();
      }),
    } as unknown as jest.Mocked<RedisService>;

    const appConfig = {
      redis: { ttlSeconds: 60 },
    } as unknown as AppConfigService;

    service = new IdempotencyService(redis, appConfig);
  });

  it('marks a new key once and rejects the duplicate', async () => {
    await expect(service.markIdempotencyKey('abc')).resolves.toBe(true);
    await expect(service.markIdempotencyKey('abc')).resolves.toBe(false);
  });

  it('detects duplicates', async () => {
    await expect(service.isDuplicate('abc')).resolves.toBe(false);
    await service.markIdempotencyKey('abc');
    await expect(service.isDuplicate('abc')).resolves.toBe(true);
  });
});
