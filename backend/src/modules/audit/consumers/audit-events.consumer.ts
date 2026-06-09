import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { AuditWriterService } from '../audit-writer.service';

interface AuditQueueMessage {
  readonly action: string;
  readonly entity: string;
  readonly entityId: string;
  readonly actor: string;
  readonly payload?: Record<string, unknown> | null;
  readonly metadata?: Record<string, unknown> | null;
  readonly occurredAt?: string;
}

@Injectable()
export class AuditEventsConsumer {
  private readonly logger = new Logger(AuditEventsConsumer.name);

  constructor(private readonly writer: AuditWriterService) {}

  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_EXCHANGE ?? 'fleetcore.events',
    routingKey: 'audit.event',
    queue: process.env.RABBITMQ_AUDIT_QUEUE ?? 'fleetcore.audit',
  })
  async handleAuditEvent(message: AuditQueueMessage) {
    try {
      await this.writer.persist({
        action: message.action,
        entity: message.entity,
        entityId: message.entityId,
        actor: message.actor,
        payload: message.payload ?? undefined,
        metadata: message.metadata ?? undefined,
        occurredAt: message.occurredAt
          ? new Date(message.occurredAt)
          : new Date(),
      });
    } catch (error) {
      this.logger.error(
        `Failed to persist audit event for entity ${message.entity}`,
        error as Error,
      );
    }
  }
}
