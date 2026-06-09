import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';
import { DataSource, DataSourceOptions } from 'typeorm';

import { RedisService } from './cache/redis.service';
import { RepositoryCacheService } from './cache/repository-cache.service';
import { UnitOfWork } from './unit-of-work/unit-of-work';
import { AppConfigService } from './config/app-config.service';
import { FeatureToggleService } from './features';
import { FeatureFlagGuard } from './features/feature-enabled.decorator';
import { EventBusService } from './domain/events';
import { ResilienceService } from './resilience/resilience.service';
import { DomainMetricsService } from './metrics/domain-metrics.service';

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
        const dataSource = new DataSource(options);
        return dataSource.initialize();
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
    AppConfigService,
    FeatureToggleService,
    FeatureFlagGuard,
    EventBusService,
    ResilienceService,
    DomainMetricsService,
  ],
})
export class SharedModule {}
