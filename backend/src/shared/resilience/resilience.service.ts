import { Injectable, Logger } from '@nestjs/common';
import {
  CircuitBreakerPolicy,
  ConsecutiveBreaker,
  ExponentialBackoff,
  Policy,
  RetryPolicy,
  TimeoutPolicy,
  circuitBreaker,
  handleAll,
  retry,
  timeout,
  wrap,
} from 'cockatiel';
import {
  decorrelatedJitterGenerator,
  noJitterGenerator,
} from 'cockatiel/dist/backoff/ExponentialBackoffGenerators.js';

import type {
  CircuitBreakerConfig,
  ResiliencePolicyConfig,
  RetryPolicyConfig,
} from '../config/app-config.types';
import { AppConfigService } from '../config/app-config.service';

interface ExecuteOptions {
  readonly name: string;
  readonly retry?: Partial<RetryPolicyConfig>;
  readonly circuitBreaker?: Partial<CircuitBreakerConfig>;
  readonly timeoutMs?: number;
}

@Injectable()
export class ResilienceService {
  private readonly logger = new Logger(ResilienceService.name);
  private readonly retryPolicies = new Map<string, RetryPolicy>();
  private readonly circuitBreakerPolicies = new Map<string, CircuitBreakerPolicy>();
  private readonly timeoutPolicies = new Map<string, TimeoutPolicy>();

  constructor(private readonly config: AppConfigService) {}

  async execute<TResult>(
    task: () => Promise<TResult>,
    options: ExecuteOptions,
  ): Promise<TResult> {
    const policies = this.resolvePolicies(options);

    if (policies.length === 0) {
      return task();
    }

    const chained = wrap(...policies);
    return chained.execute(() => task());
  }

  getDefaultMessagingPolicy(): ResiliencePolicyConfig {
    return this.config.resilience.messaging;
  }

  getDefaultHttpPolicy(): ResiliencePolicyConfig {
    return this.config.resilience.http;
  }

  private resolvePolicies({
    name,
    retry: retryOverrides,
    circuitBreaker: circuitOverrides,
    timeoutMs,
  }: ExecuteOptions): Policy[] {
    const list: Policy[] = [];

    if (timeoutMs && timeoutMs > 0) {
      list.push(this.getTimeoutPolicy(name, timeoutMs));
    }

    const defaults = this.resolveDefaults(name);
    const retryConfig: RetryPolicyConfig = {
      ...defaults.retry,
      ...(retryOverrides ?? {}),
    };
    if (retryConfig.attempts > 1) {
      list.push(this.getRetryPolicy(name, retryConfig));
    }

    const circuitConfig: CircuitBreakerConfig = {
      ...defaults.circuitBreaker,
      ...(circuitOverrides ?? {}),
    };
    if (circuitConfig.failureThreshold > 0) {
      list.push(this.getCircuitBreakerPolicy(name, circuitConfig));
    }

    return list;
  }

  private getTimeoutPolicy(name: string, timeoutMs: number): TimeoutPolicy {
    const key = `${name}:timeout:${timeoutMs}`;
    const cached = this.timeoutPolicies.get(key);
    if (cached) {
      return cached;
    }

    const created = timeout(timeoutMs, {
      strategy: 'Cooperative',
      abortOnReturn: false,
    });
    this.timeoutPolicies.set(key, created);
    return created;
  }

  private getRetryPolicy(name: string, options: RetryPolicyConfig): RetryPolicy {
    const key = `${name}:retry:${options.attempts}:${options.initialDelayMs}:${options.maxDelayMs}:${options.jitter}`;
    const cached = this.retryPolicies.get(key);
    if (cached) {
      return cached;
    }

    const backoff = new ExponentialBackoff({
      initialDelay: options.initialDelayMs,
      maxDelay: options.maxDelayMs,
      generator: options.jitter ? decorrelatedJitterGenerator : noJitterGenerator,
    });

    const created = retry(handleAll, {
      maxAttempts: options.attempts,
      backoff,
    });

    created.onRetry((reason) => {
      const message = 'error' in reason && reason.error instanceof Error
        ? reason.error.message
        : 'Retrying after failure';
      this.logger.warn(`Retrying operation ${name}: ${message}`);
    });

    this.retryPolicies.set(key, created);
    return created;
  }

  private getCircuitBreakerPolicy(
    name: string,
    options: CircuitBreakerConfig,
  ): CircuitBreakerPolicy {
    const key = `${name}:breaker:${options.failureThreshold}:${options.successThreshold}:${options.openDurationMs}:${options.halfOpenSampleCount}`;
    const cached = this.circuitBreakerPolicies.get(key);
    if (cached) {
      return cached;
    }

    const breaker = circuitBreaker(handleAll, {
      halfOpenAfter: options.openDurationMs,
      breaker: new ConsecutiveBreaker(options.failureThreshold),
      halfOpenSampling:
        options.halfOpenSampleCount > 1
          ? { calls: options.halfOpenSampleCount, threshold: 0 }
          : undefined,
    });

    breaker.onBreak((error) => {
      const message =
        'error' in error && error.error instanceof Error
          ? error.error.message
          : 'Circuit opened';
      this.logger.error(`Circuit breaker open for ${name}: ${message}`);
    });

    breaker.onReset(() => {
      this.logger.log(`Circuit breaker reset for ${name}`);
    });

    breaker.onHalfOpen(() => {
      this.logger.warn(`Circuit breaker half-open for ${name}`);
    });

    this.circuitBreakerPolicies.set(key, breaker);
    return breaker;
  }

  private resolveDefaults(name: string): ResiliencePolicyConfig {
    return name.startsWith('http')
      ? this.config.resilience.http
      : this.config.resilience.messaging;
  }
}
