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

const TAG_LABELS: Record<string, { name: string; description: string }[]> = {
  'pt-BR': [
    {
      name: 'Authentication',
      description: 'Fluxos de login e gestão de sessão.',
    },
    { name: 'Fleet', description: 'Operações com marcas, modelos e veículos.' },
    { name: 'Audit', description: 'Eventos de auditoria e rastreabilidade.' },
  ],
  'en-US': [
    {
      name: 'Authentication',
      description: 'Login, token issuance and session handling.',
    },
    { name: 'Fleet', description: 'Brands, models and vehicle operations.' },
    { name: 'Audit', description: 'Audit trail and observability endpoints.' },
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
        'Informe o token JWT gerado pelo endpoint de login.' +
        (config.locale === 'en-US'
          ? ' Provide the JWT issued by the login endpoint.'
          : ''),
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
  swaggerOptions: {
    persistAuthorization: true,
    displayOperationId: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
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
