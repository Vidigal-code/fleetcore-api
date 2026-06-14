import { Injectable, Logger } from '@nestjs/common';

import { MessagingService } from '../messaging/messaging.service';
import { FeatureToggleService } from '../../shared/features';
import { AuditWriterService } from './audit-writer.service';
import { AUDIT_ROUTING_KEY, AUDIT_SOURCE_INLINE } from './audit.constants';

export interface AuditRecordInput {
  action: string;
  entity: string;
  entityId: string;
  actor: string;
  eventId?: string;
  eventType?: string;
  correlationId?: string;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  method?: string;
  route?: string;
  statusCode?: number;
  success?: boolean;
  payload?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  occurredAt?: Date;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly messaging: MessagingService,
    private readonly featureToggles: FeatureToggleService,
    private readonly writer: AuditWriterService,
  ) {}

  async record(entry: AuditRecordInput): Promise<void> {
    const event = this.buildAuditEvent(entry);

    if (!this.featureToggles.isEnabled('auditAsyncWorker', true)) {
      await this.persistInline(event);
      return;
    }

    await this.publishOrFallback(event);
  }

  private buildAuditEvent(entry: AuditRecordInput): AuditRecordInput {
    return {
      ...entry,
      payload: entry.payload ?? undefined,
      metadata: entry.metadata ?? undefined,
      occurredAt: entry.occurredAt ?? new Date(),
    };
  }

  private async publishOrFallback(event: AuditRecordInput): Promise<void> {
    try {
      await this.messaging.publish(AUDIT_ROUTING_KEY, this.toMessage(event));
    } catch (error) {
      this.logger.error(
        'Failed to enqueue audit entry, persisting synchronously',
        error as Error,
      );
      await this.persistInline(event);
    }
  }

  private async persistInline(event: AuditRecordInput): Promise<void> {
    await this.writer.persist(event, { sourceQueue: AUDIT_SOURCE_INLINE });
  }

  private toMessage(event: AuditRecordInput): Record<string, unknown> {
    return {
      ...event,
      occurredAt: (event.occurredAt ?? new Date()).toISOString(),
    };
  }
}
