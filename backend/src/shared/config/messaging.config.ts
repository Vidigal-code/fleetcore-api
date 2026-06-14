import { registerAs } from '@nestjs/config';

const parseInteger = (value: string | undefined, fallback: number) => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export default registerAs('messaging', () => ({
  uri: process.env.RABBITMQ_URI,
  exchange: process.env.RABBITMQ_EXCHANGE ?? 'fleetcore.events',
  queue: process.env.RABBITMQ_QUEUE ?? 'fleetcore.vehicles',
  auditQueue: process.env.RABBITMQ_AUDIT_QUEUE ?? 'fleetcore.audit',
  retryQueue: process.env.RABBITMQ_RETRY_QUEUE ?? 'fleetcore.retry',
  deadLetterQueue: process.env.RABBITMQ_DLQ ?? 'fleetcore.dead-letter',
  workerConcurrency: parseInteger(process.env.WORKER_CONCURRENCY, 2),
  connection: {
    timeoutMs: parseInteger(process.env.RABBITMQ_CONNECT_TIMEOUT_MS, 15_000),
    reconnectSeconds: parseInteger(process.env.RABBITMQ_RECONNECT_SECONDS, 5),
    heartbeatSeconds: parseInteger(process.env.RABBITMQ_HEARTBEAT_SECONDS, 30),
  },
}));
