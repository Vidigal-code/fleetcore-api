import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';

import { IdempotencyService } from './idempotency.service';

const IDEMPOTENCY_HEADER = 'idempotency-key';

/**
 * Transparently de-duplicates mutating requests that carry an
 * `Idempotency-Key` header. Requests without the header are untouched, so the
 * interceptor is safe to apply broadly without changing existing contracts.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.headers[IDEMPOTENCY_HEADER];

    if (typeof key === 'string' && key.length > 0) {
      const scopedKey = `${request.method}:${request.path}:${key}`;
      const isNew = await this.idempotencyService.markIdempotencyKey(scopedKey);
      if (!isNew) {
        throw new ConflictException(
          'Duplicate request: idempotency key already processed',
        );
      }
    }

    return next.handle();
  }
}
