import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { AUDIT_OUTBOX_STATUS_PENDING } from '../audit.constants';

/**
 * Transactional-outbox entry. When the API cannot publish an audit event to
 * RabbitMQ (broker down), the event is stored here as `pending` and a
 * background relay republishes it once the broker recovers.
 */
@Schema({
  collection: 'audit_outbox',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class AuditOutbox {
  /** RabbitMQ routing key the message must be republished with. */
  @Prop({ required: true })
  routingKey!: string;

  /** The exact message body to republish (already serialized for the queue). */
  @Prop({ type: Object, required: true })
  message!: Record<string, any>;

  @Prop({ required: true, default: AUDIT_OUTBOX_STATUS_PENDING, index: true })
  status!: string;

  @Prop({ required: true, default: 0 })
  attempts!: number;

  @Prop()
  lastError?: string;
}

export type AuditOutboxDocument = AuditOutbox & Document;

export const AuditOutboxSchema = SchemaFactory.createForClass(AuditOutbox);
