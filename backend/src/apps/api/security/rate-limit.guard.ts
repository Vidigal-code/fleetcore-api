import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { AppConfigService } from '../../../shared/config/app-config.service';
import { RateLimitService } from '../../../shared/cache/rate-limit.service';
import { AuditService } from '../../../modules/audit/audit.service';
import type { JwtPayload } from '../../../modules/auth/domain/jwt-payload.interface';
import { RATE_LIMIT_KEY, RateLimitOptions } from './rate-limit.decorator';

interface ResolvedBudget {
  readonly max: number;
  readonly windowSeconds: number;
}

type AuthenticatedRequest = Request & { user?: JwtPayload };

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimitService: RateLimitService,
    private readonly appConfigService: AppConfigService,
    private readonly auditService: AuditService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const config = this.appConfigService.rateLimit;
    if (!config.enabled) {
      return true;
    }

    const { max, windowSeconds } = this.resolveBudget(context);
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const scope = this.buildScope(request);

    const result = await this.rateLimitService.consume(
      scope,
      max,
      windowSeconds,
    );

    if (!result.allowed) {
      this.recordBlocked(request, scope, result.retryAfter);
      throw new HttpException(
        {
          success: false,
          message: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private resolveBudget(context: ExecutionContext): ResolvedBudget {
    const config = this.appConfigService.rateLimit;
    const override = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    const profileBudget: ResolvedBudget =
      override?.profile === 'auth'
        ? {
            max: config.authMaxRequests,
            windowSeconds: config.authWindowSeconds,
          }
        : { max: config.maxRequests, windowSeconds: config.windowSeconds };

    return {
      max: override?.max ?? profileBudget.max,
      windowSeconds: override?.windowSeconds ?? profileBudget.windowSeconds,
    };
  }

  private buildScope(request: AuthenticatedRequest): string {
    const identity = request.user?.sub
      ? `user:${request.user.sub}`
      : `ip:${request.ip ?? 'unknown'}`;
    const endpoint = `endpoint:${request.method}:${this.resolveRoute(request)}`;
    return `${identity}:${endpoint}`;
  }

  private resolveRoute(request: AuthenticatedRequest): string {
    const route = (request as { route?: { path?: string } }).route;
    return route?.path ?? request.path;
  }

  private recordBlocked(
    request: AuthenticatedRequest,
    scope: string,
    retryAfter: number,
  ): void {
    void this.auditService.record({
      action: `${request.method} ${this.resolveRoute(request)}`,
      entity: 'rate_limit',
      entityId: scope,
      actor: request.user?.nickname ?? 'anonymous',
      payload: { retryAfter },
      metadata: {
        eventType: 'rate_limit.blocked',
        ip: request.ip,
        method: request.method,
        route: this.resolveRoute(request),
      },
    });
  }
}
