import { AuthSessionService } from '../../../src/modules/auth/application/auth-session.service';
import type { RedisService } from '../../../src/shared/cache/redis.service';
import type { AppConfigService } from '../../../src/shared/config/app-config.service';

describe('AuthSessionService', () => {
  let store: Map<string, string>;
  let client: { expire: jest.Mock };
  let redis: jest.Mocked<RedisService>;
  let service: AuthSessionService;

  beforeEach(() => {
    store = new Map();
    client = {
      expire: jest.fn().mockResolvedValue(1),
    };

    redis = {
      set: jest.fn((key: string, value: string) => {
        store.set(key, value);
        return Promise.resolve();
      }),
      get: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
      delete: jest.fn((key: string) => {
        store.delete(key);
        return Promise.resolve();
      }),
      getClient: jest.fn(() => client),
    } as unknown as jest.Mocked<RedisService>;

    const appConfig = {
      auth: { sessionTtlSeconds: 3600 },
      redis: { lockTtlSeconds: 30 },
    } as unknown as AppConfigService;

    service = new AuthSessionService(redis, appConfig);
  });

  it('stores and reports an active session', async () => {
    await service.store('sess-1', 'user-1');

    await expect(service.isActive('sess-1')).resolves.toBe(true);
    await expect(service.isActive('missing')).resolves.toBe(false);
  });

  it('revokes a session', async () => {
    await service.store('sess-1', 'user-1');
    await service.revoke('sess-1');

    await expect(service.isActive('sess-1')).resolves.toBe(false);
  });

  it('refreshes the TTL of an existing session', async () => {
    await service.refresh('sess-1');

    expect(client.expire).toHaveBeenCalledWith('auth.sessions:sess-1', 3600);
  });

  it('locks, reports and unlocks a session', async () => {
    await service.lock('sess-1');
    await expect(service.isLocked('sess-1')).resolves.toBe(true);

    await service.unlock('sess-1');
    await expect(service.isLocked('sess-1')).resolves.toBe(false);
  });
});
