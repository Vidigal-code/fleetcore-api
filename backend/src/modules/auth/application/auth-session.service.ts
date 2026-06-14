import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { RedisService } from '../../../shared/cache/redis.service';
import { AppConfigService } from '../../../shared/config/app-config.service';
import {
  AUTH_SESSION_LOCK_NAMESPACE,
  AUTH_SESSION_NAMESPACE,
} from '../auth.constants';

interface SessionPayload {
  readonly userId: string;
  readonly createdAt: string;
}

@Injectable()
export class AuthSessionService {
  private readonly ttlSeconds: number;
  private readonly lockTtlSeconds: number;

  constructor(
    private readonly redisService: RedisService,
    appConfigService: AppConfigService,
  ) {
    this.ttlSeconds = appConfigService.auth.sessionTtlSeconds;
    this.lockTtlSeconds = appConfigService.redis.lockTtlSeconds;
  }

  generateSessionId(): string {
    return randomUUID();
  }

  async store(sessionId: string, userId: string): Promise<void> {
    const payload: SessionPayload = {
      userId,
      createdAt: new Date().toISOString(),
    };
    await this.redisService.set(
      this.buildKey(sessionId),
      JSON.stringify(payload),
      this.ttlSeconds,
    );
  }

  async revoke(sessionId: string): Promise<void> {
    await this.redisService.delete(this.buildKey(sessionId));
  }

  async isActive(sessionId: string): Promise<boolean> {
    const session = await this.redisService.get(this.buildKey(sessionId));
    return Boolean(session);
  }

  async refresh(sessionId: string): Promise<boolean> {
    const renewed = await this.redisService
      .getClient()
      .expire(this.buildKey(sessionId), this.ttlSeconds);
    return renewed === 1;
  }

  async lock(sessionId: string): Promise<void> {
    await this.redisService.set(
      this.buildLockKey(sessionId),
      new Date().toISOString(),
      this.lockTtlSeconds,
    );
  }

  async unlock(sessionId: string): Promise<void> {
    await this.redisService.delete(this.buildLockKey(sessionId));
  }

  async isLocked(sessionId: string): Promise<boolean> {
    const lock = await this.redisService.get(this.buildLockKey(sessionId));
    return Boolean(lock);
  }

  private buildKey(sessionId: string): string {
    return `${AUTH_SESSION_NAMESPACE}:${sessionId}`;
  }

  private buildLockKey(sessionId: string): string {
    return `${AUTH_SESSION_LOCK_NAMESPACE}:${sessionId}`;
  }
}
