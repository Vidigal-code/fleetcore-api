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

// Tema visual do Swagger UI, alinhado à identidade do Fleetcore (slate + accent
// indigo). Injetado via customCss para não depender de assets externos.
const SWAGGER_CUSTOM_CSS = `
  :root {
    --fc-bg: #0b1120;
    --fc-surface: #111a2e;
    --fc-border: #24314d;
    --fc-text: #e2e8f0;
    --fc-muted: #94a3b8;
    --fc-accent: #6366f1;
    --fc-accent-strong: #818cf8;
  }
  body { background: var(--fc-bg); }
  .swagger-ui, .swagger-ui .info .title, .swagger-ui .opblock-tag,
  .swagger-ui .opblock .opblock-summary-operation-id,
  .swagger-ui .opblock .opblock-summary-description,
  .swagger-ui table thead tr th, .swagger-ui .response-col_status,
  .swagger-ui label, .swagger-ui .parameter__name, .swagger-ui .model-title,
  .swagger-ui .models h4 { color: var(--fc-text); }
  .swagger-ui .scheme-container, .swagger-ui section.models,
  .swagger-ui .opblock .opblock-section-header { background: var(--fc-surface); box-shadow: none; }
  .swagger-ui .info { margin: 28px 0; }
  .swagger-ui .topbar { background: linear-gradient(90deg, #0b1120 0%, #1e293b 100%); border-bottom: 1px solid var(--fc-border); padding: 14px 0; }
  .swagger-ui .topbar .download-url-wrapper { display: none; }
  .swagger-ui .info .title small.version-stamp { background: var(--fc-accent); }
  .swagger-ui .info a, .swagger-ui a.nostyle, .swagger-ui .info .title small { color: var(--fc-accent-strong); }
  .swagger-ui .btn.authorize { color: var(--fc-accent-strong); border-color: var(--fc-accent); }
  .swagger-ui .btn.authorize svg { fill: var(--fc-accent-strong); }
  .swagger-ui .btn.execute { background: var(--fc-accent); border-color: var(--fc-accent); color: #fff; }
  .swagger-ui .opblock { border: 1px solid var(--fc-border); border-radius: 14px; background: var(--fc-surface); box-shadow: 0 8px 24px rgba(2, 6, 23, 0.35); margin: 0 0 16px; }
  .swagger-ui .opblock .opblock-summary { border-color: var(--fc-border); }
  .swagger-ui .opblock-tag { border-color: var(--fc-border); font-size: 18px; }
  .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #2563eb; }
  .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #16a34a; }
  .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: #d97706; }
  .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #dc2626; }
  .swagger-ui .opblock-summary-method { border-radius: 8px; }
  .swagger-ui input[type=text], .swagger-ui input[type=password], .swagger-ui textarea,
  .swagger-ui select { background: var(--fc-bg); color: var(--fc-text); border: 1px solid var(--fc-border); border-radius: 8px; }
  .swagger-ui .opblock-description-wrapper p, .swagger-ui .parameter__type,
  .swagger-ui .renderedMarkdown p, .swagger-ui .response-col_description { color: var(--fc-muted); }
  .swagger-ui .filter .operation-filter-input { border-radius: 10px; }
  .swagger-ui .model-box, .swagger-ui .highlight-code { background: var(--fc-bg); }
`;

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
  customCss: SWAGGER_CUSTOM_CSS,
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
