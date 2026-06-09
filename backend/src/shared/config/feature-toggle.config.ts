import { registerAs } from '@nestjs/config';

import type { FeatureToggleConfig, FeatureToggleMap } from './app-config.types';

export const defaultFeatureToggles: FeatureToggleMap = {
  auditAsyncWorker: true,
  domainEvents: true,
  repositoryCache: true,
  swaggerDocs: true,
};

export default registerAs(
  'features',
  (): FeatureToggleConfig => ({
    flags: { ...defaultFeatureToggles },
  }),
);
