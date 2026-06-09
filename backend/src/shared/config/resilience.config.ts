import { registerAs } from '@nestjs/config';

import type { ResilienceConfig } from './app-config.types';

const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const DEFAULT_MESSAGING_ATTEMPTS = 5;
const DEFAULT_HTTP_ATTEMPTS = 3;
const DEFAULT_INITIAL_DELAY_MS = 100;
const DEFAULT_MAX_DELAY_MS = 2000;
const DEFAULT_FAILURE_THRESHOLD = 5;
const DEFAULT_SUCCESS_THRESHOLD = 2;
const DEFAULT_OPEN_DURATION_MS = 15000;
const DEFAULT_HALF_OPEN_SAMPLE_COUNT = 1;

export default registerAs(
  'resilience',
  (): ResilienceConfig => ({
    messaging: {
      retry: {
        attempts: parseNumber(
          process.env.RESILIENCE_MESSAGING_RETRY_ATTEMPTS,
          DEFAULT_MESSAGING_ATTEMPTS,
        ),
        initialDelayMs: parseNumber(
          process.env.RESILIENCE_MESSAGING_RETRY_INITIAL_DELAY_MS,
          DEFAULT_INITIAL_DELAY_MS,
        ),
        maxDelayMs: parseNumber(
          process.env.RESILIENCE_MESSAGING_RETRY_MAX_DELAY_MS,
          DEFAULT_MAX_DELAY_MS,
        ),
        jitter: process.env.RESILIENCE_MESSAGING_RETRY_JITTER !== 'false',
      },
      circuitBreaker: {
        failureThreshold: parseNumber(
          process.env.RESILIENCE_MESSAGING_FAILURE_THRESHOLD,
          DEFAULT_FAILURE_THRESHOLD,
        ),
        successThreshold: parseNumber(
          process.env.RESILIENCE_MESSAGING_SUCCESS_THRESHOLD,
          DEFAULT_SUCCESS_THRESHOLD,
        ),
        openDurationMs: parseNumber(
          process.env.RESILIENCE_MESSAGING_OPEN_DURATION_MS,
          DEFAULT_OPEN_DURATION_MS,
        ),
        halfOpenSampleCount: parseNumber(
          process.env.RESILIENCE_MESSAGING_HALF_OPEN_SAMPLE_COUNT,
          DEFAULT_HALF_OPEN_SAMPLE_COUNT,
        ),
      },
    },
    http: {
      retry: {
        attempts: parseNumber(
          process.env.RESILIENCE_HTTP_RETRY_ATTEMPTS,
          DEFAULT_HTTP_ATTEMPTS,
        ),
        initialDelayMs: parseNumber(
          process.env.RESILIENCE_HTTP_RETRY_INITIAL_DELAY_MS,
          DEFAULT_INITIAL_DELAY_MS,
        ),
        maxDelayMs: parseNumber(
          process.env.RESILIENCE_HTTP_RETRY_MAX_DELAY_MS,
          DEFAULT_MAX_DELAY_MS,
        ),
        jitter: process.env.RESILIENCE_HTTP_RETRY_JITTER !== 'false',
      },
      circuitBreaker: {
        failureThreshold: parseNumber(
          process.env.RESILIENCE_HTTP_FAILURE_THRESHOLD,
          DEFAULT_FAILURE_THRESHOLD,
        ),
        successThreshold: parseNumber(
          process.env.RESILIENCE_HTTP_SUCCESS_THRESHOLD,
          DEFAULT_SUCCESS_THRESHOLD,
        ),
        openDurationMs: parseNumber(
          process.env.RESILIENCE_HTTP_OPEN_DURATION_MS,
          DEFAULT_OPEN_DURATION_MS,
        ),
        halfOpenSampleCount: parseNumber(
          process.env.RESILIENCE_HTTP_HALF_OPEN_SAMPLE_COUNT,
          DEFAULT_HALF_OPEN_SAMPLE_COUNT,
        ),
      },
    },
  }),
);
