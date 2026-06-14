import { Injectable, Logger } from '@nestjs/common';
import {
  CircuitBreakerPolicy,
  ConsecutiveBreaker,
  ExponentialBackoff,
  RetryPolicy,
  TimeoutPolicy,
  TimeoutStrategy,
  circuitBreaker,
  handleAll,
  retry,
  timeout,
  ConstantBackoff,
} from 'cockatiel';

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

interface RetryOnlyOptions {
  readonly name: string;
  readonly retry?: Partial<RetryPolicyConfig>;
  readonly timeoutMs?: number;
}

export interface RollbackStep<T = unknown> {
  readonly execute: () => Promise<T>;
  readonly compensate?: (result: T) => Promise<void>;
}

const DISABLED_CIRCUIT_BREAKER: Partial<CircuitBreakerConfig> = {
  failureThreshold: 0,
};

@Injectable()
export class ResilienceService {
  private readonly logger = new Logger(ResilienceService.name);
  private readonly retryPolicies = new Map<string, RetryPolicy>();
  private readonly circuitBreakerPolicies = new Map<
    string,
    CircuitBreakerPolicy
  >();
  private readonly timeoutPolicies = new Map<string, TimeoutPolicy>();

  constructor(private readonly config: AppConfigService) {}

  async execute<TResult>(
    task: () => Promise<TResult>,
    options: ExecuteOptions,
  ): Promise<TResult> {
    const { timeoutPolicy, retryPolicy, circuitBreakerPolicy } =
      this.resolvePolicies(options);

    let operation = () => task();

    if (circuitBreakerPolicy) {
      const previous = operation;
      operation = () => circuitBreakerPolicy.execute(() => previous());
    }

    if (retryPolicy) {
      const previous = operation;
      operation = () => retryPolicy.execute(() => previous());
    }

    if (timeoutPolicy) {
      const previous = operation;
      operation = () => timeoutPolicy.execute(() => previous());
    }

    return operation();
  }

  /** Runs a task with retry only (circuit breaker disabled). */
  async executeWithRetry<TResult>(
    task: () => Promise<TResult>,
    options: RetryOnlyOptions,
  ): Promise<TResult> {
    return this.execute(task, {
      ...options,
      circuitBreaker: DISABLED_CIRCUIT_BREAKER,
    });
  }

  /**
   * Runs a task and, if it fails after its resilience policies are exhausted,
   * resolves with the controlled fallback instead of throwing.
   */
  async executeWithFallback<TResult>(
    task: () => Promise<TResult>,
    fallback: (error: unknown) => Promise<TResult>,
    options?: ExecuteOptions,
  ): Promise<TResult> {
    try {
      return options ? await this.execute(task, options) : await task();
    } catch (error) {
      this.logger.warn(
        `Falling back for ${options?.name ?? 'operation'}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
      return fallback(error);
    }
  }

  /**
   * Runs steps sequentially. If any step fails, the compensations of the
   * already-completed steps run in reverse order before the error rethrows.
   */
  async executeWithRollback(steps: RollbackStep[]): Promise<unknown[]> {
    const completed: Array<{ step: RollbackStep; result: unknown }> = [];

    try {
      const results: unknown[] = [];
      for (const step of steps) {
        const result = await step.execute();
        completed.push({ step, result });
        results.push(result);
      }
      return results;
    } catch (error) {
      await this.compensate(completed);
      throw error;
    }
  }

  private async compensate(
    completed: Array<{ step: RollbackStep; result: unknown }>,
  ): Promise<void> {
    for (const { step, result } of [...completed].reverse()) {
      if (!step.compensate) {
        continue;
      }
      try {
        await step.compensate(result);
      } catch (compensationError) {
        this.logger.error(
          'Rollback compensation failed',
          compensationError as Error,
        );
      }
    }
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
  }: ExecuteOptions) {
    const timeoutPolicy =
      timeoutMs && timeoutMs > 0
        ? this.getTimeoutPolicy(name, timeoutMs)
        : undefined;

    const defaults = this.resolveDefaults(name);
    const retryConfig: RetryPolicyConfig = {
      ...defaults.retry,
      ...(retryOverrides ?? {}),
    };
    const retryPolicy =
      retryConfig.attempts > 1
        ? this.getRetryPolicy(name, retryConfig)
        : undefined;

    const circuitConfig: CircuitBreakerConfig = {
      ...defaults.circuitBreaker,
      ...(circuitOverrides ?? {}),
    };
    const circuitBreakerPolicy =
      circuitConfig.failureThreshold > 0
        ? this.getCircuitBreakerPolicy(name, circuitConfig)
        : undefined;

    return { timeoutPolicy, retryPolicy, circuitBreakerPolicy };
  }

  private getTimeoutPolicy(name: string, timeoutMs: number): TimeoutPolicy {
    const key = `${name}:timeout:${timeoutMs}`;
    const cached = this.timeoutPolicies.get(key);
    if (cached) {
      return cached;
    }

    const created = timeout(timeoutMs, {
      strategy: TimeoutStrategy.Cooperative,
      abortOnReturn: false,
    });
    this.timeoutPolicies.set(key, created);
    return created;
  }

  private getRetryPolicy(
    name: string,
    options: RetryPolicyConfig,
  ): RetryPolicy {
    const key = `${name}:retry:${options.attempts}:${options.initialDelayMs}:${options.maxDelayMs}:${options.jitter}`;
    const cached = this.retryPolicies.get(key);
    if (cached) {
      return cached;
    }

    const backoff = options.jitter
      ? new ExponentialBackoff({
          initialDelay: options.initialDelayMs,
          maxDelay: options.maxDelayMs,
        })
      : new ConstantBackoff(options.initialDelayMs);

    const created = retry(handleAll, {
      maxAttempts: options.attempts,
      backoff,
    });

    created.onRetry((reason) => {
      const message =
        'error' in reason && reason.error instanceof Error
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
