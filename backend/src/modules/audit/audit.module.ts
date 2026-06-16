import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuditService } from './audit.service';
import { AuditEvent, AuditEventSchema } from './schemas/audit-event.schema';
import { AuditOutbox, AuditOutboxSchema } from './schemas/audit-outbox.schema';
import { AuditInterceptor } from './interceptors/audit.interceptor';
import { AuditWriterService } from './audit-writer.service';
import { AuditOutboxService } from './audit-outbox.service';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditEvent.name, schema: AuditEventSchema },
      { name: AuditOutbox.name, schema: AuditOutboxSchema },
    ]),
    MessagingModule,
  ],
  providers: [
    AuditService,
    AuditWriterService,
    AuditOutboxService,
    AuditInterceptor,
  ],
  exports: [
    AuditService,
    AuditWriterService,
    AuditOutboxService,
    AuditInterceptor,
  ],
})
export class AuditModule {}
