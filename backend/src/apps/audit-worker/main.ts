import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AuditWorkerModule } from './audit-worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AuditWorkerModule);
  const logger = new Logger('AuditWorker');
  logger.log('Audit worker started and awaiting messages');

  app.enableShutdownHooks();
}

void bootstrap();
