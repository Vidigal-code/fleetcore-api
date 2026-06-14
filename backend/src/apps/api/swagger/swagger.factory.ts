import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger';

import type {
  SwaggerConfig,
  SwaggerDocumentConfig,
} from '../../../shared/config/swagger.config';
import { buildSwaggerCss } from './swagger-theme';

const TAG_LABELS: Record<string, { name: string; description: string }[]> = {
  'pt-BR': [
    {
      name: 'Authentication',
      description: 'Login e tokens JWT.',
    },
    { name: 'Fleet', description: 'Marcas, modelos e veículos.' },
    { name: 'Audit', description: 'Trilhas de auditoria.' },
  ],
  'en-US': [
    {
      name: 'Authentication',
      description: 'Login and JWT tokens.',
    },
    { name: 'Fleet', description: 'Brands, models and vehicles.' },
    { name: 'Audit', description: 'Audit trail actions.' },
  ],
};

const formatPath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const buildDocumentOptions = (): SwaggerDocumentOptions => ({
  operationIdFactory: (controllerKey: string, methodKey: string) =>
    `${controllerKey.replace(/Controller$/u, '')}.${methodKey}`,
});

const createDocumentBuilder = (
  config: SwaggerDocumentConfig,
  globalPrefix: string,
) => {
  const builder = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version)
    .setContact(config.contactName, '', config.contactEmail)
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        config.locale === 'en-US'
          ? 'Provide the JWT generated on the login endpoint.'
          : 'Informe o JWT emitido no endpoint de login.',
    });

  const tags = TAG_LABELS[config.locale] ?? TAG_LABELS['en-US'];
  tags.forEach((tag) => builder.addTag(tag.name, tag.description));

  if (globalPrefix) {
    builder.addServer(globalPrefix);
  } else {
    builder.addServer('/');
  }

  return builder;
};

const createSwaggerDocument = (
  app: INestApplication,
  config: SwaggerDocumentConfig,
  globalPrefix: string,
) => {
  const builder = createDocumentBuilder(config, globalPrefix);
  const document = SwaggerModule.createDocument(
    app,
    builder.build(),
    buildDocumentOptions(),
  );

  return document;
};

const createCustomOptions = (
  config: SwaggerDocumentConfig,
): SwaggerCustomOptions => ({
  customSiteTitle: `${config.title} · ${config.locale}`,
  customfavIcon: 'https://fav.farm/🚚',
  customCss: buildSwaggerCss(),
  swaggerOptions: {
    persistAuthorization: true,
    displayOperationId: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    tryItOutEnabled: true,
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 3,
    syntaxHighlight: { theme: 'obsidian' },
  },
});

const setupSwaggerDocument = (
  app: INestApplication,
  config: SwaggerDocumentConfig,
  globalPrefix: string,
) => {
  const document = createSwaggerDocument(app, config, globalPrefix);
  const customOptions = createCustomOptions(config);
  SwaggerModule.setup(formatPath(config.path), app, document, customOptions);
};

export const setupSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  const appConfig = configService.get<{ globalPrefix?: string }>('app');
  const globalPrefix = appConfig?.globalPrefix
    ? `/${appConfig.globalPrefix}`.replace(/\/+$/u, '')
    : '';

  if (!swaggerConfig || swaggerConfig.documents.length === 0) {
    return;
  }

  swaggerConfig.documents.forEach((documentConfig) =>
    setupSwaggerDocument(app, documentConfig, globalPrefix),
  );
};

export const collectSwaggerDocuments = (
  app: INestApplication,
): Array<{ config: SwaggerDocumentConfig; document: OpenAPIObject }> => {
  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  const appConfig = configService.get<{ globalPrefix?: string }>('app');
  const globalPrefix = appConfig?.globalPrefix
    ? `/${appConfig.globalPrefix}`.replace(/\/+$/u, '')
    : '';

  if (!swaggerConfig || swaggerConfig.documents.length === 0) {
    return [];
  }

  return swaggerConfig.documents.map((documentConfig) => ({
    config: documentConfig,
    document: createSwaggerDocument(app, documentConfig, globalPrefix),
  }));
};
