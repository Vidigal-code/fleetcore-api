import { Injectable } from '@nestjs/common';

import { AppConfigService } from '../config/app-config.service';
import type { FeatureFlagKey } from '../config/app-config.types';

@Injectable()
export class FeatureToggleService {
  constructor(private readonly appConfig: AppConfigService) {}

  isEnabled(flag: FeatureFlagKey, defaultValue = false): boolean {
    return this.appConfig.getFeatureFlag(flag, defaultValue);
  }

  async runIfEnabled<TResult>(
    flag: FeatureFlagKey,
    task: () => Promise<TResult> | TResult,
    fallback?: () => Promise<TResult> | TResult,
  ): Promise<TResult | undefined> {
    if (this.isEnabled(flag)) {
      return task();
    }

    return fallback?.();
  }
}
