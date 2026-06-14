import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { Observable, tap } from 'rxjs';

import { AuditService, AuditRecordInput } from '../audit.service';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';
import type { JwtPayload } from '../../auth/domain/jwt-payload.interface';

type AuditableRequest = Request & {
  user?: JwtPayload;
  requestId?: string;
  correlationId?: string;
};

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (this.isPublic(context)) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<AuditableRequest>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap((responseBody: unknown) => {
        void this.auditService.record(
          this.buildAuditEvent(request, response, responseBody),
        );
      }),
    );
  }

  private isPublic(context: ExecutionContext): boolean {
    return Boolean(
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]),
    );
  }

  private buildAuditEvent(
    request: AuditableRequest,
    response: Response,
    responseBody: unknown,
  ): AuditRecordInput {
    const correlationId = this.resolveCorrelationId(request);
    const route = this.resolveRoute(request);
    const statusCode = response.statusCode;

    return {
      action: `${request.method} ${request.url}`,
      entity: 'http',
      entityId: correlationId,
      actor: request.user?.nickname ?? 'anonymous',
      eventId: randomUUID(),
      eventType: `http.${request.method.toLowerCase()}`,
      correlationId,
      requestId: request.requestId ?? correlationId,
      userId: request.user?.sub,
      sessionId: request.user?.sessionId,
      method: request.method,
      route,
      statusCode,
      success: statusCode < 400,
      payload: this.toPayload(responseBody),
      metadata: {
        ip: request.ip,
        params: request.params,
        query: request.query,
        userAgent: request.headers['user-agent']?.toString(),
      },
    };
  }

  private resolveCorrelationId(request: AuditableRequest): string {
    return (
      request.headers['x-correlation-id']?.toString() ??
      request.correlationId ??
      randomUUID()
    );
  }

  private resolveRoute(request: AuditableRequest): string {
    const route = (request as { route?: { path?: string } }).route;
    return route?.path ?? request.url;
  }

  private toPayload(
    responseBody: unknown,
  ): Record<string, unknown> | undefined {
    return typeof responseBody === 'object' && responseBody !== null
      ? (responseBody as Record<string, unknown>)
      : undefined;
  }
}
