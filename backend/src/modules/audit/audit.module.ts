import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuditService } from './audit.service';
import { AuditEvent, AuditEventSchema } from './schemas/audit-event.schema';
import { AuditInterceptor } from './interceptors/audit.interceptor';
import { AuditWriterService } from './audit-writer.service';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditEvent.name, schema: AuditEventSchema },
    ]),
    MessagingModule,
  ],
  providers: [AuditService, AuditWriterService, AuditInterceptor],
  exports: [AuditService, AuditWriterService, AuditInterceptor],
})
export class AuditModule {}
