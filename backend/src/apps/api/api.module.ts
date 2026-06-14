import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from '../../shared/shared.module';
import { validateEnvironment } from '../../shared/config/env.validation';
import appConfig from '../../shared/config/app.config';
import databaseConfig from '../../shared/config/database.config';
import redisConfig from '../../shared/config/redis.config';
import jwtConfig from '../../shared/config/jwt.config';
import messagingConfig from '../../shared/config/messaging.config';
import auditConfig from '../../shared/config/audit.config';
import authConfig from '../../shared/config/auth.config';
import securityConfig, {
  SecurityConfig,
} from '../../shared/config/security.config';
import featureToggleConfig from '../../shared/config/feature-toggle.config';
import swaggerConfig from '../../shared/config/swagger.config';
import resilienceConfig from '../../shared/config/resilience.config';
import rateLimitConfig from '../../shared/config/rate-limit.config';
import { AuthModule } from '../../modules/auth/auth.module';
import { FleetModule } from '../../modules/fleet/fleet.module';
import { AuditModule } from '../../modules/audit/audit.module';
import { MessagingModule } from '../../modules/messaging/messaging.module';
import { UsersModule } from '../../modules/users/users.module';
import { AppBootstrapService } from './app-bootstrap.service';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { AuditInterceptor } from '../../modules/audit/interceptors/audit.interceptor';
import { RateLimitGuard } from './security/rate-limit.guard';
import { IdempotencyInterceptor } from '../../shared/cache/idempotency.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        jwtConfig,
        messagingConfig,
        auditConfig,
        authConfig,
        securityConfig,
        featureToggleConfig,
        swaggerConfig,
        resilienceConfig,
        rateLimitConfig,
      ],
      validate: validateEnvironment,
    }),
    SharedModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const security = configService.get<SecurityConfig>('security');
        const ttl = security?.rateLimit.ttl ?? 60;
        const limit = security?.rateLimit.limit ?? 100;

        return {
          throttlers: [
            {
              ttl,
              limit,
            },
          ],
        };
      },
    }),
    AuthModule,
    FleetModule,
    AuditModule,
    MessagingModule,
    UsersModule,
  ],
  providers: [
    AppBootstrapService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class ApiModule {}
