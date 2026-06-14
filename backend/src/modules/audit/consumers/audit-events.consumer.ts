import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { AppConfigService } from '../../../shared/config/app-config.service';
import { AuditWriterService } from '../audit-writer.service';
import { AUDIT_ROUTING_KEY } from '../audit.constants';

/** Minimal shape of an AMQP message envelope (avoids an amqplib type dep). */
interface AmqpEnvelope {
  readonly properties?: {
    readonly headers?: Record<string, unknown>;
  };
}

interface AuditQueueMessage {
  readonly action: string;
  readonly entity: string;
  readonly entityId: string;
  readonly actor: string;
  readonly eventId?: string;
  readonly eventType?: string;
  readonly correlationId?: string;
  readonly requestId?: string;
  readonly userId?: string;
  readonly sessionId?: string;
  readonly method?: string;
  readonly route?: string;
  readonly statusCode?: number;
  readonly success?: boolean;
  readonly payload?: Record<string, unknown> | null;
  readonly metadata?: Record<string, unknown> | null;
  readonly occurredAt?: string;
}

@Injectable()
export class AuditEventsConsumer {
  private readonly logger = new Logger(AuditEventsConsumer.name);
  private readonly sourceQueue: string;

  constructor(
    private readonly writer: AuditWriterService,
    appConfigService: AppConfigService,
  ) {
    this.sourceQueue = appConfigService.messaging.auditQueue;
  }

  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_EXCHANGE ?? 'fleetcore.events',
    routingKey: AUDIT_ROUTING_KEY,
    queue: process.env.RABBITMQ_AUDIT_QUEUE ?? 'fleetcore.audit',
  })
  async handleAuditEvent(message: AuditQueueMessage, amqpMsg?: AmqpEnvelope) {
    try {
      await this.writer.persist(
        {
          ...message,
          payload: message.payload ?? undefined,
          metadata: message.metadata ?? undefined,
          occurredAt: message.occurredAt
            ? new Date(message.occurredAt)
            : new Date(),
        },
        {
          sourceQueue: this.sourceQueue,
          retries: this.resolveRetries(amqpMsg),
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to persist audit event for entity ${message.entity}`,
        error as Error,
      );
    }
  }

  private resolveRetries(amqpMsg?: AmqpEnvelope): number {
    const deaths = amqpMsg?.properties?.headers?.['x-death'];
    if (Array.isArray(deaths) && deaths.length > 0) {
      const count = (deaths[0] as { count?: number }).count;
      return typeof count === 'number' ? count : 0;
    }
    return 0;
  }
}
