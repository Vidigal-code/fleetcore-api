import { FeatureToggleService } from '../../../src/shared/features/feature-toggle.service';

describe('FeatureToggleService', () => {
  const appConfig = {
    getFeatureFlag: jest.fn(),
  } as unknown as Parameters<typeof FeatureToggleService>[0];

  const service = new FeatureToggleService(appConfig);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns true when flag is enabled', () => {
    (appConfig.getFeatureFlag as jest.Mock).mockReturnValueOnce(true);

    expect(service.isEnabled('domainEvents')).toBe(true);
    expect(appConfig.getFeatureFlag).toHaveBeenCalledWith('domainEvents', false);
  });

  it('runs task when flag enabled', async () => {
    (appConfig.getFeatureFlag as jest.Mock).mockReturnValueOnce(true);

    const result = await service.runIfEnabled('domainEvents', async () => 'ok');

    expect(result).toBe('ok');
  });

  it('runs fallback when flag disabled', async () => {
    (appConfig.getFeatureFlag as jest.Mock).mockReturnValueOnce(false);

    const result = await service.runIfEnabled(
      'domainEvents',
      async () => 'ok',
      async () => 'fallback',
    );

    expect(result).toBe('fallback');
  });
});
