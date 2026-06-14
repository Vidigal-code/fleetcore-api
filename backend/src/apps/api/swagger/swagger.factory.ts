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
import type { SecurityConfig } from '../../../shared/config/security.config';
import { buildSwaggerCss } from './swagger-theme';

// O Swagger UI depende de <style>/<script> inline. A CSP global da API é
// estrita ('self'), o que os bloqueia e quebra o tema. Aqui derivamos uma CSP
// relaxada APENAS para as rotas de documentação, reaproveitando a CSP base e
// liberando inline + assets de imagem/fonte que o Swagger usa.
const SWAGGER_INLINE = "'unsafe-inline'";

const buildSwaggerCsp = (csp: SecurityConfig['headers']['csp']): string => {
  const withInline = (sources: string[]) =>
    sources.includes(SWAGGER_INLINE) ? sources : [...sources, SWAGGER_INLINE];
  const directives: Record<string, string[]> = {
    'default-src': csp.defaultSrc,
    'script-src': withInline(csp.scriptSrc),
    'style-src': withInline(csp.styleSrc),
    'img-src': [...new Set([...csp.imgSrc, 'data:', 'https:'])],
    'font-src': [...new Set([...csp.fontSrc, 'data:'])],
    'connect-src': csp.connectSrc,
  };
  return Object.entries(directives)
    .map(([name, sources]) => `${name} ${sources.join(' ')}`)
    .join('; ');
};

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
  // O prefixo global (/api) é exposto uma única vez via server (addServer).
  // Sem isto, o @nestjs/swagger também o injeta em cada path, e o Swagger UI
  // concatena server + path resultando em "/api/api/..." (404 ao testar).
  ignoreGlobalPrefix: true,
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

// Nome do esquema de segurança registrado por addBearerAuth() (default 'bearer')
// e trecho da rota de login usado para detectar a resposta do token.
const BEARER_SCHEME_KEY = 'bearer';
const LOGIN_PATH_MARKER = '/auth/login';

// Hook injetado no Swagger UI: intercepta a resposta do login, extrai o
// accessToken e chama preauthorizeApiKey, deixando o JWT aplicado
// automaticamente no "Authorize" — assim dá pra testar todos os endpoints
// protegidos em sequência sem copiar/colar o token.
const buildAutoAuthorizeJs = (): string =>
  `(function(){` +
  `var apply=function(token){try{if(window.ui&&token){window.ui.preauthorizeApiKey('${BEARER_SCHEME_KEY}',token);}}catch(e){}};` +
  `var orig=window.fetch;if(!orig||orig.__fcWrapped){return;}` +
  `var wrapped=function(){var args=arguments;return orig.apply(this,args).then(function(res){try{` +
  `var input=args[0];var url=(input&&input.url)?input.url:String(input);` +
  `if(url.indexOf('${LOGIN_PATH_MARKER}')!==-1&&res.ok){res.clone().json().then(function(b){` +
  `if(b&&b.accessToken){apply(b.accessToken);}}).catch(function(){});}` +
  `}catch(e){}return res;});};` +
  `wrapped.__fcWrapped=true;window.fetch=wrapped;})();`;

const createCustomOptions = (
  config: SwaggerDocumentConfig,
): SwaggerCustomOptions => ({
  customSiteTitle: `${config.title} · ${config.locale}`,
  customfavIcon: 'https://fav.farm/🚚',
  customCss: buildSwaggerCss(),
  customJsStr: buildAutoAuthorizeJs(),
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
  cspHeader?: string,
) => {
  const path = formatPath(config.path);

  // CSP relaxada apenas nas rotas de documentação (a API segue estrita).
  if (cspHeader) {
    app.use(
      path,
      (
        _req,
        res: { setHeader: (k: string, v: string) => void },
        next: () => void,
      ) => {
        res.setHeader('Content-Security-Policy', cspHeader);
        next();
      },
    );
  }

  const document = createSwaggerDocument(app, config, globalPrefix);
  const customOptions = createCustomOptions(config);
  SwaggerModule.setup(path, app, document, customOptions);
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

  const security = configService.get<SecurityConfig>('security');
  const cspHeader = security
    ? buildSwaggerCsp(security.headers.csp)
    : undefined;

  swaggerConfig.documents.forEach((documentConfig) =>
    setupSwaggerDocument(app, documentConfig, globalPrefix, cspHeader),
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
