import type { AppConfigService } from '../../../src/shared/config/app-config.service';
import type { FeatureFlagKey } from '../../../src/shared/config/app-config.types';
import { FeatureToggleService } from '../../../src/shared/features/feature-toggle.service';

describe('FeatureToggleService', () => {
  const getFeatureFlagMock = jest.fn<boolean, [FeatureFlagKey, boolean | undefined]>();
  const appConfigMock = {
    getFeatureFlag: getFeatureFlagMock,
  } as unknown as AppConfigService;

  const service = new FeatureToggleService(appConfigMock);

  beforeEach(() => {
    getFeatureFlagMock.mockReset();
  });

  it('returns true when flag is enabled', () => {
    getFeatureFlagMock.mockReturnValueOnce(true);

    expect(service.isEnabled('domainEvents')).toBe(true);
    expect(getFeatureFlagMock).toHaveBeenCalledWith('domainEvents', false);
  });

  it('runs task when flag enabled', async () => {
    getFeatureFlagMock.mockReturnValueOnce(true);

    const result = await service.runIfEnabled('domainEvents', async () => 'ok');

    expect(result).toBe('ok');
  });

  it('runs fallback when flag disabled', async () => {
    getFeatureFlagMock.mockReturnValueOnce(false);

    const result = await service.runIfEnabled(
      'domainEvents',
      async () => 'ok',
      async () => 'fallback',
    );

    expect(result).toBe('fallback');
  });
});
