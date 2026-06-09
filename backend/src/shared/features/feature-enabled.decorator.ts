import {
  applyDecorators,
  ForbiddenException,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import type { FeatureFlagKey } from '../config/app-config.types';
import { FeatureToggleService } from './feature-toggle.service';

const FEATURE_KEY = 'feature:flag';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  private featureService?: FeatureToggleService;

  constructor(private readonly moduleRef: ModuleRef) {}

  canActivate(context: ExecutionContext): boolean {
    const flag = Reflect.getMetadata(
      FEATURE_KEY,
      context.getHandler(),
    ) as FeatureFlagKey | undefined;
    if (!flag) {
      return true;
    }

    if (!this.featureService) {
      this.featureService = this.moduleRef.get(FeatureToggleService, {
        strict: false,
      });
    }

    const isEnabled = this.featureService?.isEnabled(flag, false) ?? false;
    if (!isEnabled) {
      throw new ForbiddenException(`Feature flag "${flag}" is disabled.`);
    }

    return true;
  }
}

export const FeatureEnabled = (flag: FeatureFlagKey) =>
  applyDecorators(SetMetadata(FEATURE_KEY, flag), UseGuards(FeatureFlagGuard));
