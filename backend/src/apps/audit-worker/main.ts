import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppConfigService } from '../../shared/config/app-config.service';
import { AuditWorkerModule } from './audit-worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AuditWorkerModule);
  const logger = new Logger('AuditWorker');

  const concurrency = app.get(AppConfigService).messaging.workerConcurrency;
  logger.log(
    `Audit worker started and awaiting messages (concurrency=${concurrency})`,
  );

  app.enableShutdownHooks();
}

void bootstrap();
