import { Injectable, Logger } from '@nestjs/common';

import { MessagingService } from '../messaging/messaging.service';
import { FeatureToggleService } from '../../shared/features';
import { AuditWriterService } from './audit-writer.service';

export interface AuditRecordInput {
  action: string;
  entity: string;
  entityId: string;
  actor: string;
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

  async record(entry: AuditRecordInput) {
    const payload = {
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      actor: entry.actor,
      payload: entry.payload ?? undefined,
      metadata: entry.metadata ?? undefined,
      occurredAt: (entry.occurredAt ?? new Date()).toISOString(),
    };

    if (!this.featureToggles.isEnabled('auditAsyncWorker', true)) {
      await this.writer.persist({
        ...entry,
        occurredAt: new Date(payload.occurredAt),
      });
      return;
    }

    try {
      await this.messaging.publish('audit.event', payload);
    } catch (error) {
      this.logger.error(
        'Failed to enqueue audit entry, persisting synchronously',
        error as Error,
      );
      await this.writer.persist({
        ...entry,
        occurredAt: new Date(payload.occurredAt),
      });
    }
  }
}
