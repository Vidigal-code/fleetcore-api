import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Environment } from './env.validation';
import type { SecurityConfig } from './security.config';
import type { SwaggerConfig } from './swagger.config';
import {
  AppConfig,
  AuditConfig,
  DatabaseConfig,
  FeatureFlagKey,
  FeatureToggleConfig,
  FeatureToggleMap,
  JwtConfig,
  MessagingConfig,
  ResilienceConfig,
  RedisConfig,
} from './app-config.types';
import { defaultFeatureToggles } from './feature-toggle.config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get environment(): Environment {
    return this.configService.get<Environment>('NODE_ENV', 'development');
  }

  get app(): AppConfig {
    return this.configService.get<AppConfig>('app') ?? {
      name: 'fleetcore-api',
      port: 3000,
      globalPrefix: 'api',
    };
  }

  get redis(): RedisConfig {
    return {
      host: this.configService.get<string>('redis.host', 'redis'),
      port: this.configService.get<number>('redis.port', 6379),
      ttlSeconds: this.configService.get<number>('redis.ttlSeconds', 60),
    };
  }

  get database(): DatabaseConfig {
    const database = this.configService.get<DatabaseConfig>('database');
    if (!database) {
      throw new Error('Database configuration is missing');
    }

    return database;
  }

  get jwt(): JwtConfig {
    return {
      secret: this.configService.getOrThrow<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn', '3600s'),
    };
  }

  get messaging(): MessagingConfig {
    return {
      uri: this.configService.getOrThrow<string>('messaging.uri'),
      exchange: this.configService.get<string>('messaging.exchange', 'fleetcore.events'),
      queue: this.configService.get<string>('messaging.queue', 'fleetcore.vehicles'),
      auditQueue: this.configService.get<string>('messaging.auditQueue', 'fleetcore.audit'),
    };
  }

  get audit(): AuditConfig {
    return {
      mongoUri: this.configService.getOrThrow<string>('audit.mongoUri'),
    };
  }

  get security(): SecurityConfig {
    return this.configService.getOrThrow<SecurityConfig>('security');
  }

  get swagger(): SwaggerConfig {
    return this.configService.get<SwaggerConfig>('swagger') ?? { documents: [] };
  }

  get features(): FeatureToggleConfig {
    const flags = this.configService.get<FeatureToggleMap>('features.flags');
    return {
      flags: { ...defaultFeatureToggles, ...(flags ?? {}) },
    };
  }

  get resilience(): ResilienceConfig {
    const value = this.configService.get<ResilienceConfig>('resilience');
    if (!value) {
      throw new Error('Resilience configuration is missing');
    }
    return value;
  }

  getFeatureFlag(flag: FeatureFlagKey, defaultValue = false): boolean {
    return this.features.flags[flag] ?? defaultValue;
  }
}
