import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { randomUUID } from 'crypto';

import type { SecurityConfig } from '../../../shared/config/security.config';

interface CorsEvaluationResult {
  originAllowed: boolean;
  reason?: string;
}

const headerLogger = new Logger('Security');

interface RequestContext {
  requestId?: string;
  correlationId?: string;
}

type HttpRequest = Request & RequestContext;

type ReferrerPolicyDirective =
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

const evaluateOrigin = (
  origin: string | undefined,
  security: SecurityConfig,
): CorsEvaluationResult => {
  if (!origin) {
    return { originAllowed: true };
  }

  const normalizedOrigin = origin.trim();
  const { allowedOrigins } = security.cors;

  if (allowedOrigins.length === 0) {
    return { originAllowed: false, reason: 'No allowed origins configured' };
  }

  if (allowedOrigins.includes('*')) {
    return { originAllowed: true };
  }

  const match = allowedOrigins.some(
    (allowed) => allowed.toLowerCase() === normalizedOrigin.toLowerCase(),
  );

  return match
    ? { originAllowed: true }
    : {
        originAllowed: false,
        reason: `Origin ${normalizedOrigin} not in allow-list`,
      };
};

const configureCors = (app: INestApplication, security: SecurityConfig) => {
  if (!security.cors.enabled) {
    headerLogger.log('CORS is disabled by configuration');
    return;
  }

  const corsOptions: CorsOptions = {
    credentials: security.cors.allowCredentials,
    methods: security.cors.allowedMethods,
    allowedHeaders: security.cors.allowedHeaders,
    exposedHeaders: security.cors.exposedHeaders,
    maxAge: security.cors.maxAge,
    origin: (origin, callback) => {
      const evaluation = evaluateOrigin(origin, security);

      if (evaluation.originAllowed) {
        callback(null, true);
        return;
      }

      headerLogger.warn(
        `Blocked CORS request: ${evaluation.reason ?? 'Unknown reason'}`,
      );
      callback(new Error('CORS origin not allowed'), false);
    },
  };

  app.enableCors(corsOptions);
};

const configureHelmet = (app: INestApplication, security: SecurityConfig) => {
  const { headers } = security;

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: headers.csp.defaultSrc,
          scriptSrc: headers.csp.scriptSrc,
          styleSrc: headers.csp.styleSrc,
          imgSrc: headers.csp.imgSrc,
          connectSrc: headers.csp.connectSrc,
          fontSrc: headers.csp.fontSrc,
          frameAncestors: headers.csp.frameAncestors,
        },
      },
      referrerPolicy: {
        policy: headers.referrerPolicy as ReferrerPolicyDirective,
      },
      frameguard: { action: headers.frameGuard },
      xPoweredBy: false,
      hsts: headers.hsts.enabled
        ? {
            maxAge: headers.hsts.maxAge,
            includeSubDomains: headers.hsts.includeSubDomains,
            preload: headers.hsts.preload,
          }
        : false,
      noSniff: headers.contentTypeOptions,
      xssFilter: headers.xssProtection,
    }),
  );
};

const configureCustomHeaders = (
  app: INestApplication,
  security: SecurityConfig,
) => {
  app.use((req: HttpRequest, res: Response, next: NextFunction) => {
    const existingRequestId = req.headers['x-request-id'];
    const existingCorrelationId = req.headers['x-correlation-id'];
    const requestId = Array.isArray(existingRequestId)
      ? existingRequestId[0]
      : (existingRequestId ?? randomUUID());
    const correlationId = Array.isArray(existingCorrelationId)
      ? existingCorrelationId[0]
      : (existingCorrelationId ?? requestId);

    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Correlation-Id', correlationId);
    res.setHeader('Permissions-Policy', security.headers.permissionsPolicy);

    if (security.headers.expectCt.enabled) {
      const directives = [`max-age=${security.headers.expectCt.maxAge}`];
      if (security.headers.expectCt.enforce) {
        directives.push('enforce');
      }
      if (security.headers.expectCt.reportUri) {
        directives.push(`report-uri="${security.headers.expectCt.reportUri}"`);
      }
      res.setHeader('Expect-CT', directives.join(', '));
    }

    if (security.headers.originAgentCluster) {
      res.setHeader('Origin-Agent-Cluster', '?1');
    }

    req.requestId = requestId;
    req.correlationId = correlationId;

    headerLogger.debug(
      `Processed request ${req.method} ${req.originalUrl ?? req.url} :: requestId=${requestId}`,
    );

    next();
  });
};

export const applySecurity = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const security = configService.get<SecurityConfig>('security');

  if (!security) {
    headerLogger.warn('Security configuration not found; using defaults');
    return;
  }

  configureCors(app, security);
  configureHelmet(app, security);
  configureCustomHeaders(app, security);
};
