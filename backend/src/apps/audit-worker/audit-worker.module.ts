import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnvironment } from '../../shared/config/env.validation';
import appConfig from '../../shared/config/app.config';
import databaseConfig from '../../shared/config/database.config';
import redisConfig from '../../shared/config/redis.config';
import jwtConfig from '../../shared/config/jwt.config';
import messagingConfig from '../../shared/config/messaging.config';
import auditConfig from '../../shared/config/audit.config';
import authConfig from '../../shared/config/auth.config';
import securityConfig from '../../shared/config/security.config';
import featureToggleConfig from '../../shared/config/feature-toggle.config';
import resilienceConfig from '../../shared/config/resilience.config';
import rateLimitConfig from '../../shared/config/rate-limit.config';
import swaggerConfig from '../../shared/config/swagger.config';
import { SharedModule } from '../../shared/shared.module';
import { AuditModule } from '../../modules/audit/audit.module';
import { MessagingModule } from '../../modules/messaging/messaging.module';
import { AuditEventsConsumer } from '../../modules/audit/consumers/audit-events.consumer';

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
        resilienceConfig,
        rateLimitConfig,
        swaggerConfig,
      ],
      validate: validateEnvironment,
    }),
    SharedModule,
    MessagingModule,
    AuditModule,
  ],
  providers: [AuditEventsConsumer],
})
export class AuditWorkerModule {}
