import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { randomUUID } from 'node:crypto';
import { Observable, tap } from 'rxjs';

import { AuditService } from '../audit.service';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';
import type { JwtPayload } from '../../auth/domain/jwt-payload.interface';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<
      Request & {
        user?: JwtPayload;
        requestId?: string;
        correlationId?: string;
      }
    >();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return next.handle();
    }
    const actor = request.user?.nickname ?? 'anonymous';
    const correlationId =
      request.headers['x-correlation-id']?.toString() ??
      request.correlationId ??
      randomUUID();
    const action = `${request.method} ${request.url}`;
    const metadata = {
      correlationId,
      requestId: request.requestId ?? correlationId,
      ip: request.ip,
      params: request.params,
      query: request.query,
      userAgent: request.headers['user-agent']?.toString(),
    };

    return next.handle().pipe(
      tap((responseBody: unknown) => {
        const payload =
          typeof responseBody === 'object' && responseBody !== null
            ? (responseBody as Record<string, unknown>)
            : null;

        void this.auditService.record({
          action,
          entity: 'http',
          entityId: correlationId,
          actor,
          payload,
          metadata,
        });
      }),
    );
  }
}
