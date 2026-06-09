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

  @Prop({ type: Object })
  payload?: Record<string, any>;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ required: true, default: Date.now })
  occurredAt!: Date;
}

export type AuditEventDocument = AuditEvent & Document;

export const AuditEventSchema = SchemaFactory.createForClass(AuditEvent);
