import type { DataSourceOptions } from 'typeorm';

import type { Environment } from './env.validation';

export interface AppConfig {
  readonly name: string;
  readonly port: number;
  readonly globalPrefix?: string;
}

export interface RedisConfig {
  readonly host: string;
  readonly port: number;
  readonly ttlSeconds: number;
}

export type DatabaseConfig = DataSourceOptions;

export interface JwtConfig {
  readonly secret: string;
  readonly expiresIn: string;
}

export interface MessagingConfig {
  readonly uri: string;
  readonly exchange: string;
  readonly queue: string;
  readonly auditQueue: string;
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
