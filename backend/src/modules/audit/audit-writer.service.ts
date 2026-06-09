import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import type { AuditRecordInput } from './audit.service';
import { AuditEvent, AuditEventDocument } from './schemas/audit-event.schema';

@Injectable()
export class AuditWriterService {
  constructor(
    @InjectModel(AuditEvent.name)
    private readonly auditModel: Model<AuditEventDocument>,
  ) {}

  async persist(entry: AuditRecordInput) {
    await this.auditModel.create({
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      actor: entry.actor,
      payload: entry.payload ?? undefined,
      metadata: entry.metadata ?? undefined,
      occurredAt: entry.occurredAt ?? new Date(),
    });
  }
}
