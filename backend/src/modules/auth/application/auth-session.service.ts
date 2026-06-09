import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { RedisService } from '../../../shared/cache/redis.service';
import { AppConfigService } from '../../../shared/config/app-config.service';
import { AUTH_SESSION_NAMESPACE } from '../auth.constants';

interface SessionPayload {
  readonly userId: string;
  readonly createdAt: string;
}

@Injectable()
export class AuthSessionService {
  private readonly ttlSeconds: number;

  constructor(
    private readonly redisService: RedisService,
    appConfigService: AppConfigService,
  ) {
    this.ttlSeconds = appConfigService.auth.sessionTtlSeconds;
  }

  generateSessionId(): string {
    return randomUUID();
  }

  async store(sessionId: string, userId: string): Promise<void> {
    const key = this.buildKey(sessionId);
    const payload: SessionPayload = {
      userId,
      createdAt: new Date().toISOString(),
    };
    await this.redisService.set(key, JSON.stringify(payload), this.ttlSeconds);
  }

  async revoke(sessionId: string): Promise<void> {
    const key = this.buildKey(sessionId);
    await this.redisService.delete(key);
  }

  async isActive(sessionId: string): Promise<boolean> {
    const key = this.buildKey(sessionId);
    const session = await this.redisService.get(key);
    return Boolean(session);
  }

  private buildKey(sessionId: string): string {
    return `${AUTH_SESSION_NAMESPACE}:${sessionId}`;
  }
}
