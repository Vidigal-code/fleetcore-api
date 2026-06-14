import { RedisLockService } from '../../../src/shared/cache/redis-lock.service';
import type { RedisService } from '../../../src/shared/cache/redis.service';
import type { AppConfigService } from '../../../src/shared/config/app-config.service';

describe('RedisLockService', () => {
  let store: Map<string, string>;
  let client: { set: jest.Mock; eval: jest.Mock };
  let redis: jest.Mocked<RedisService>;
  let service: RedisLockService;

  beforeEach(() => {
    store = new Map();
    client = {
      // Emulates SET key token NX EX ttl
      set: jest.fn((key: string, token: string) => {
        if (store.has(key)) {
          return Promise.resolve(null);
        }
        store.set(key, token);
        return Promise.resolve('OK');
      }),
      // Emulates the compare-and-delete / compare-and-expire Lua scripts
      eval: jest.fn(
        (script: string, _numKeys: number, key: string, token: string) => {
          if (store.get(key) !== token) {
            return Promise.resolve(0);
          }
          if (script.includes('del')) {
            store.delete(key);
          }
          return Promise.resolve(1);
        },
      ),
    };

    redis = {
      getClient: jest.fn(() => client),
    } as unknown as jest.Mocked<RedisService>;

    const appConfig = {
      redis: { lockTtlSeconds: 30 },
    } as unknown as AppConfigService;

    service = new RedisLockService(redis, appConfig);
  });

  it('acquires a lock when free and refuses when held', async () => {
    const first = await service.acquireLock('vehicle:1');
    expect(first).not.toBeNull();

    const second = await service.acquireLock('vehicle:1');
    expect(second).toBeNull();
  });

  it('only releases the lock for the owner token', async () => {
    const handle = await service.acquireLock('vehicle:1');
    expect(handle).not.toBeNull();

    const stolen = await service.releaseLock({
      resource: 'vehicle:1',
      token: 'someone-else',
    });
    expect(stolen).toBe(false);

    const released = await service.releaseLock(handle!);
    expect(released).toBe(true);
  });

  it('runs a callback under lock and releases afterwards', async () => {
    const result = await service.withLock('vehicle:1', () =>
      Promise.resolve('done'),
    );
    expect(result).toBe('done');

    // Lock must be free again after withLock completes.
    const reacquired = await service.acquireLock('vehicle:1');
    expect(reacquired).not.toBeNull();
  });
});
