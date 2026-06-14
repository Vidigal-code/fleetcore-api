import type { DataSourceOptions } from 'typeorm';

export interface AppConfig {
  readonly name: string;
  readonly port: number;
  readonly globalPrefix?: string;
}

export interface RedisConfig {
  readonly host: string;
  readonly port: number;
  readonly ttlSeconds: number;
  readonly lockTtlSeconds: number;
}

export interface RateLimitConfig {
  readonly enabled: boolean;
  readonly windowSeconds: number;
  readonly maxRequests: number;
  readonly authWindowSeconds: number;
  readonly authMaxRequests: number;
}

export interface AuthConfig {
  readonly adminNickname: string;
  readonly adminEmail: string;
  readonly adminName: string;
  readonly adminPassword: string;
  readonly sessionTtlSeconds: number;
}

export type DatabaseConfig = DataSourceOptions;

export interface JwtConfig {
  readonly secret: string;
  readonly expiresIn: string;
}

export interface MessagingConnectionConfig {
  readonly timeoutMs: number;
  readonly reconnectSeconds: number;
  readonly heartbeatSeconds: number;
}

export interface MessagingConfig {
  readonly uri: string;
  readonly exchange: string;
  readonly queue: string;
  readonly auditQueue: string;
  readonly retryQueue: string;
  readonly deadLetterQueue: string;
  readonly workerConcurrency: number;
  readonly connection: MessagingConnectionConfig;
}

export interface AuditConfig {
  readonly mongoUri: string;
}

export interface FeatureToggleMap {
  readonly auditAsyncWorker: boolean;
  readonly domainEvents: boolean;
  readonly repositoryCache: boolean;
  readonly swaggerDocs: boolean;
}

export interface FeatureToggleConfig {
  readonly flags: FeatureToggleMap;
}

export type FeatureFlagKey = keyof FeatureToggleMap;

export interface RetryPolicyConfig {
  readonly attempts: number;
  readonly initialDelayMs: number;
  readonly maxDelayMs: number;
  readonly jitter: boolean;
}

export interface CircuitBreakerConfig {
  readonly failureThreshold: number;
  readonly successThreshold: number;
  readonly openDurationMs: number;
  readonly halfOpenSampleCount: number;
}

export interface ResiliencePolicyConfig {
  readonly retry: RetryPolicyConfig;
  readonly circuitBreaker: CircuitBreakerConfig;
}

export interface ResilienceConfig {
  readonly messaging: ResiliencePolicyConfig;
  readonly http: ResiliencePolicyConfig;
}
