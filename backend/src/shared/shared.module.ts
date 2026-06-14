import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';
import { DataSource, DataSourceOptions } from 'typeorm';

import { RedisService } from './cache/redis.service';
import { RepositoryCacheService } from './cache/repository-cache.service';
import { RedisLockService } from './cache/redis-lock.service';
import { IdempotencyService } from './cache/idempotency.service';
import { IdempotencyInterceptor } from './cache/idempotency.interceptor';
import { RateLimitService } from './cache/rate-limit.service';
import { UnitOfWork } from './unit-of-work/unit-of-work';
import { AppConfigService } from './config/app-config.service';
import { FeatureToggleService } from './features';
import { FeatureFlagGuard } from './features/feature-enabled.decorator';
import { EventBusService } from './domain/events';
import { ResilienceService } from './resilience/resilience.service';
import { DomainMetricsService } from './metrics/domain-metrics.service';

const toNonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): DataSourceOptions => {
        const options = configService.get<DataSourceOptions>('database');
        if (!options) {
          throw new Error('Database configuration is missing');
        }
        return options;
      },
      dataSourceFactory: async (options: DataSourceOptions) => {
        const sqlOptions = options as DataSourceOptions & {
          type?: string;
          password?: string;
        };

        if (sqlOptions.type !== 'mssql') {
          const dataSource = new DataSource(options);
          return dataSource.initialize();
        }

        const primaryPassword = toNonEmptyString(sqlOptions.password);
        const fallbackPassword = toNonEmptyString(
          process.env.SQLSERVER_PASSWORD_FALLBACK,
        );
        const legacyPassword = toNonEmptyString(
          process.env.SQLSERVER_LEGACY_PASSWORD,
        );
        const defaultPassword = 'YourStrong@Passw0rd';
        const secondaryDefaultPassword = 'YourStrong!Passw0rd';

        const candidates = [
          primaryPassword,
          fallbackPassword,
          legacyPassword,
          defaultPassword,
          secondaryDefaultPassword,
        ].filter(
          (value): value is string =>
            typeof value === 'string' && value.length > 0,
        );

        const uniqueCandidates = Array.from(new Set(candidates));

        let lastError: Error | undefined;

        for (const candidate of uniqueCandidates) {
          const attemptOptions = {
            ...options,
            password: candidate,
          } as DataSourceOptions;

          const dataSource = new DataSource(attemptOptions);
          try {
            await dataSource.initialize();
            return dataSource;
          } catch (error) {
            lastError =
              error instanceof Error ? error : new Error(String(error ?? ''));
            if (dataSource.isInitialized) {
              await dataSource.destroy().catch(() => undefined);
            }
          }
        }

        if (lastError) {
          throw lastError;
        }

        throw new Error(
          'Unable to connect to SQL Server. No valid password candidate succeeded.',
        );
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('audit.mongoUri'),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.getOrThrow<string>('redis.host'),
            port: configService.getOrThrow<number>('redis.port'),
          },
        });

        return {
          store,
          ttl: configService.get<number>('redis.ttlSeconds') ?? 60,
        } as const;
      },
    }),
  ],
  providers: [
    UnitOfWork,
    RedisService,
    RepositoryCacheService,
    RedisLockService,
    IdempotencyService,
    IdempotencyInterceptor,
    RateLimitService,
    AppConfigService,
    FeatureToggleService,
    FeatureFlagGuard,
    EventBusService,
    ResilienceService,
    DomainMetricsService,
  ],
  exports: [
    UnitOfWork,
    RedisService,
    RepositoryCacheService,
    RedisLockService,
    IdempotencyService,
    IdempotencyInterceptor,
    RateLimitService,
    AppConfigService,
    FeatureToggleService,
    FeatureFlagGuard,
    EventBusService,
    ResilienceService,
    DomainMetricsService,
  ],
})
export class SharedModule {}
