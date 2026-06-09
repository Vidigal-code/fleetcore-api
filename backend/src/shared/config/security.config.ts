import { registerAs } from '@nestjs/config';

import { parseBoolean, parseNumber, parseStringArray } from './env.helpers';

export interface SecurityConfig {
  cors: {
    enabled: boolean;
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    allowCredentials: boolean;
    maxAge: number;
  };
  rateLimit: {
    ttl: number;
    limit: number;
  };
  headers: {
    hsts: {
      enabled: boolean;
      maxAge: number;
      includeSubDomains: boolean;
      preload: boolean;
    };
    referrerPolicy: string;
    frameGuard: 'deny' | 'sameorigin';
    contentTypeOptions: boolean;
    xssProtection: boolean;
    permissionsPolicy: string;
    expectCt: {
      enabled: boolean;
      enforce: boolean;
      maxAge: number;
      reportUri?: string | null;
    };
    originAgentCluster: boolean;
    csp: {
      defaultSrc: string[];
      scriptSrc: string[];
      styleSrc: string[];
      imgSrc: string[];
      connectSrc: string[];
      fontSrc: string[];
      frameAncestors: string[];
    };
  };
}

const defaultCsp = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'"],
  imgSrc: ["'self'", 'data:'],
  connectSrc: ["'self'"],
  fontSrc: ["'self'", 'data:'],
  frameAncestors: ["'none'"],
};

export default registerAs(
  'security',
  (): SecurityConfig => ({
    cors: {
      enabled: parseBoolean(process.env.SECURITY_CORS_ENABLED, true),
      allowedOrigins: parseStringArray(
        process.env.SECURITY_CORS_ALLOWED_ORIGINS,
        ['*'],
      ),
      allowedMethods: parseStringArray(
        process.env.SECURITY_CORS_ALLOWED_METHODS,
        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      ),
      allowedHeaders: parseStringArray(
        process.env.SECURITY_CORS_ALLOWED_HEADERS,
        ['Authorization', 'Content-Type', 'Accept', 'X-Request-Id'],
      ),
      exposedHeaders: parseStringArray(
        process.env.SECURITY_CORS_EXPOSED_HEADERS,
        ['X-Request-Id'],
      ),
      allowCredentials: parseBoolean(
        process.env.SECURITY_CORS_ALLOW_CREDENTIALS,
        false,
      ),
      maxAge: parseNumber(process.env.SECURITY_CORS_MAX_AGE, 600),
    },
    rateLimit: {
      ttl: parseNumber(process.env.SECURITY_RATE_LIMIT_TTL, 60),
      limit: parseNumber(process.env.SECURITY_RATE_LIMIT_MAX, 100),
    },
    headers: {
      hsts: {
        enabled: parseBoolean(process.env.SECURITY_HSTS_ENABLED, true),
        maxAge: parseNumber(process.env.SECURITY_HSTS_MAX_AGE, 15552000),
        includeSubDomains: parseBoolean(
          process.env.SECURITY_HSTS_INCLUDE_SUBDOMAINS,
          true,
        ),
        preload: parseBoolean(process.env.SECURITY_HSTS_PRELOAD, false),
      },
      referrerPolicy: process.env.SECURITY_REFERRER_POLICY ?? 'no-referrer',
      frameGuard:
        (process.env.SECURITY_FRAME_GUARD as 'deny' | 'sameorigin') ?? 'deny',
      contentTypeOptions: parseBoolean(
        process.env.SECURITY_CONTENT_TYPE_OPTIONS,
        true,
      ),
      xssProtection: parseBoolean(process.env.SECURITY_XSS_PROTECTION, true),
      permissionsPolicy:
        process.env.SECURITY_PERMISSIONS_POLICY ??
        'geolocation=(), microphone=(), camera=()',
      expectCt: {
        enabled: parseBoolean(process.env.SECURITY_EXPECT_CT_ENABLED, true),
        enforce: parseBoolean(process.env.SECURITY_EXPECT_CT_ENFORCE, true),
        maxAge: parseNumber(process.env.SECURITY_EXPECT_CT_MAX_AGE, 86400),
        reportUri: process.env.SECURITY_EXPECT_CT_REPORT_URI ?? null,
      },
      originAgentCluster: parseBoolean(
        process.env.SECURITY_ORIGIN_AGENT_CLUSTER,
        true,
      ),
      csp: {
        defaultSrc: parseStringArray(
          process.env.SECURITY_CSP_DEFAULT_SRC,
          defaultCsp.defaultSrc,
        ),
        scriptSrc: parseStringArray(
          process.env.SECURITY_CSP_SCRIPT_SRC,
          defaultCsp.scriptSrc,
        ),
        styleSrc: parseStringArray(
          process.env.SECURITY_CSP_STYLE_SRC,
          defaultCsp.styleSrc,
        ),
        imgSrc: parseStringArray(
          process.env.SECURITY_CSP_IMG_SRC,
          defaultCsp.imgSrc,
        ),
        connectSrc: parseStringArray(
          process.env.SECURITY_CSP_CONNECT_SRC,
          defaultCsp.connectSrc,
        ),
        fontSrc: parseStringArray(
          process.env.SECURITY_CSP_FONT_SRC,
          defaultCsp.fontSrc,
        ),
        frameAncestors: parseStringArray(
          process.env.SECURITY_CSP_FRAME_ANCESTORS,
          defaultCsp.frameAncestors,
        ),
      },
    },
  }),
);
