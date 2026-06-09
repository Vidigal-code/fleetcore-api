import { ResilienceService } from '../../../src/shared/resilience/resilience.service';
import type { ResilienceConfig } from '../../../src/shared/config/app-config.types';
import type { AppConfigService } from '../../../src/shared/config/app-config.service';

const baseConfig: ResilienceConfig = {
  messaging: {
    retry: {
      attempts: 3,
      initialDelayMs: 5,
      maxDelayMs: 20,
      jitter: false,
    },
    circuitBreaker: {
      failureThreshold: 5,
      successThreshold: 1,
      openDurationMs: 50,
      halfOpenSampleCount: 1,
    },
  },
  http: {
    retry: {
      attempts: 2,
      initialDelayMs: 5,
      maxDelayMs: 20,
      jitter: false,
    },
    circuitBreaker: {
      failureThreshold: 3,
      successThreshold: 1,
      openDurationMs: 50,
      halfOpenSampleCount: 1,
    },
  },
};

const createService = () => {
  const stubConfig = {
    get resilience() {
      return baseConfig;
    },
  } as unknown as AppConfigService;

  return new ResilienceService(stubConfig);
};

describe('ResilienceService', () => {
  it('retries failed operations and resolves with success', async () => {
    const service = createService();
    const task = jest
      .fn()
      .mockRejectedValueOnce(new Error('transient'))
      .mockResolvedValueOnce('ok');

    const result = await service.execute(task, {
      name: 'messaging:test',
      retry: { attempts: 2, initialDelayMs: 0, maxDelayMs: 0 },
    });

    expect(result).toBe('ok');
    expect(task).toHaveBeenCalledTimes(2);
  });

  it('propagates error when retries exhausted', async () => {
    const service = createService();
    const task = jest.fn().mockRejectedValue(new Error('fatal'));

    await expect(
      service.execute(task, {
        name: 'messaging:test',
        retry: { attempts: 2, initialDelayMs: 0, maxDelayMs: 0 },
      }),
    ).rejects.toThrow('fatal');
  });
});
