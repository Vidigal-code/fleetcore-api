import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ResilienceService } from '../../shared/resilience/resilience.service';
import type { AuditRecordInput } from './audit.service';
import { AUDIT_STATUS_PROCESSED } from './audit.constants';
import { AuditEvent, AuditEventDocument } from './schemas/audit-event.schema';

export interface AuditPersistOptions {
  readonly sourceQueue?: string;
  readonly retries?: number;
}

@Injectable()
export class AuditWriterService {
  constructor(
    @InjectModel(AuditEvent.name)
    private readonly auditModel: Model<AuditEventDocument>,
    private readonly resilience: ResilienceService,
  ) {}

  async persist(
    entry: AuditRecordInput,
    options: AuditPersistOptions = {},
  ): Promise<void> {
    const document = this.toDocument(entry, options);
    await this.resilience.execute(() => this.auditModel.create(document), {
      name: 'audit:persist',
    });
  }

  private toDocument(entry: AuditRecordInput, options: AuditPersistOptions) {
    return {
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      actor: entry.actor,
      eventId: entry.eventId,
      eventType: entry.eventType,
      correlationId: entry.correlationId,
      requestId: entry.requestId,
      userId: entry.userId,
      sessionId: entry.sessionId,
      method: entry.method,
      route: entry.route,
      statusCode: entry.statusCode,
      success: entry.success,
      payload: entry.payload ?? undefined,
      metadata: entry.metadata ?? undefined,
      occurredAt: entry.occurredAt ?? new Date(),
      status: AUDIT_STATUS_PROCESSED,
      retries: options.retries ?? 0,
      sourceQueue: options.sourceQueue,
      processedAt: new Date(),
    };
  }
}
