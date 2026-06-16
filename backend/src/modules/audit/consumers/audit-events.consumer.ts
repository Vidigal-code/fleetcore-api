import { Injectable, Logger } from '@nestjs/common';
import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';

import { AppConfigService } from '../../../shared/config/app-config.service';
import { AuditWriterService } from '../audit-writer.service';
import { MessagingService } from '../../messaging/messaging.service';
import {
  AUDIT_MAX_DELIVERY_ATTEMPTS,
  AUDIT_ROUTING_KEY,
} from '../audit.constants';

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

const toInteger = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

@Injectable()
export class AuditEventsConsumer {
  private readonly logger = new Logger(AuditEventsConsumer.name);
  private readonly sourceQueue: string;
  private readonly deadLetterQueue: string;
  private readonly maxAttempts: number;

  constructor(
    private readonly writer: AuditWriterService,
    private readonly messaging: MessagingService,
    appConfigService: AppConfigService,
  ) {
    this.sourceQueue = appConfigService.messaging.auditQueue;
    this.deadLetterQueue = appConfigService.messaging.deadLetterQueue;
    this.maxAttempts = toInteger(
      process.env.RABBITMQ_AUDIT_MAX_ATTEMPTS,
      AUDIT_MAX_DELIVERY_ATTEMPTS,
    );
  }

  // NACK (without requeue) dead-letters a failed message to the retry queue;
  // the queue arguments route it back here after the configured delay.
  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_EXCHANGE ?? 'fleetcore.events',
    routingKey: AUDIT_ROUTING_KEY,
    queue: process.env.RABBITMQ_AUDIT_QUEUE ?? 'fleetcore.audit',
    errorBehavior: MessageHandlerErrorBehavior.NACK,
    queueOptions: {
      durable: true,
      deadLetterExchange: '',
      deadLetterRoutingKey:
        process.env.RABBITMQ_RETRY_QUEUE ?? 'fleetcore.retry',
    },
  })
  async handleAuditEvent(message: AuditQueueMessage, amqpMsg?: AmqpEnvelope) {
    const attempts = this.resolveRetries(amqpMsg);

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
          retries: attempts,
        },
      );
    } catch (error) {
      await this.handlePersistFailure(message, attempts, error);
    }
  }

  /**
   * Decide what to do when persistence fails. Below the attempt limit the
   * error is rethrown so the broker dead-letters the message into the delayed
   * retry loop. Once the limit is reached the message is parked in the
   * dead-letter queue and acknowledged so it stops cycling.
   */
  private async handlePersistFailure(
    message: AuditQueueMessage,
    attempts: number,
    error: unknown,
  ): Promise<void> {
    if (attempts >= this.maxAttempts) {
      this.logger.error(
        `Parking audit event for entity ${message.entity} in dead-letter queue after ${attempts} attempts`,
        error as Error,
      );
      await this.messaging.sendToQueue(
        this.deadLetterQueue,
        message as unknown as Record<string, unknown>,
      );
      return;
    }

    this.logger.warn(
      `Failed to persist audit event for entity ${message.entity} (attempt ${attempts + 1}/${this.maxAttempts}); scheduling retry`,
    );
    throw error;
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
