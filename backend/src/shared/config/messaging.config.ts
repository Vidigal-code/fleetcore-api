import { registerAs } from '@nestjs/config';

export default registerAs('messaging', () => ({
  uri: process.env.RABBITMQ_URI,
  exchange: process.env.RABBITMQ_EXCHANGE ?? 'fleetcore.events',
  queue: process.env.RABBITMQ_QUEUE ?? 'fleetcore.vehicles',
  auditQueue: process.env.RABBITMQ_AUDIT_QUEUE ?? 'fleetcore.audit',
}));
