import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { ApiModule } from './apps/api/api.module';
import { applySecurity } from './apps/api/security/security-setup';
import { setupSwagger } from './apps/api/swagger/swagger.factory';
import { SanitizeInputPipe } from './apps/api/security/sanitize.pipe';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  const configService = app.get(ConfigService);

  applySecurity(app);

  app.useGlobalPipes(
    new SanitizeInputPipe(),
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: false,
    }),
  );

  app.enableShutdownHooks();

  const appConfig = configService.get<{ port: number; globalPrefix?: string }>(
    'app',
  );
  const globalPrefix = appConfig?.globalPrefix ?? 'api';
  app.setGlobalPrefix(globalPrefix);

  setupSwagger(app);

  const port = appConfig?.port ?? parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(
    `HTTP server running on port ${port} with prefix /${globalPrefix}`,
  );
}

void bootstrap();
