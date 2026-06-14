import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'audit_events',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class AuditEvent {
  @Prop({ required: true })
  action!: string;

  @Prop({ required: true })
  entity!: string;

  @Prop({ required: true })
  entityId!: string;

  @Prop({ required: true })
  actor!: string;

  // Enriched audit envelope (optional, backward-compatible).
  @Prop()
  eventId?: string;

  @Prop()
  eventType?: string;

  @Prop()
  correlationId?: string;

  @Prop()
  requestId?: string;

  @Prop()
  userId?: string;

  @Prop()
  sessionId?: string;

  @Prop()
  method?: string;

  @Prop()
  route?: string;

  @Prop()
  statusCode?: number;

  @Prop()
  success?: boolean;

  @Prop({ type: Object })
  payload?: Record<string, any>;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ required: true, default: Date.now })
  occurredAt!: Date;

  // Processing metadata, written when the event is persisted.
  @Prop({ default: 'processed' })
  status?: string;

  @Prop({ default: 0 })
  retries?: number;

  @Prop()
  sourceQueue?: string;

  @Prop()
  processedAt?: Date;
}

export type AuditEventDocument = AuditEvent & Document;

export const AuditEventSchema = SchemaFactory.createForClass(AuditEvent);
