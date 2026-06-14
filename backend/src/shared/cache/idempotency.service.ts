import { Injectable } from '@nestjs/common';

import { AppConfigService } from '../config/app-config.service';
import { RedisService } from './redis.service';

const IDEMPOTENCY_NAMESPACE = 'idempotency';

@Injectable()
export class IdempotencyService {
  private readonly defaultTtlSeconds: number;

  constructor(
    private readonly redisService: RedisService,
    appConfigService: AppConfigService,
  ) {
    this.defaultTtlSeconds = appConfigService.redis.ttlSeconds;
  }

  /**
   * Atomically registers an idempotency key. Returns true when the key was
   * newly stored (first time seen) and false when it already existed.
   */
  async markIdempotencyKey(
    key: string,
    ttlSeconds = this.defaultTtlSeconds,
  ): Promise<boolean> {
    const stored = await this.redisService
      .getClient()
      .set(
        this.buildKey(key),
        new Date().toISOString(),
        'EX',
        ttlSeconds,
        'NX',
      );
    return stored === 'OK';
  }

  async isDuplicate(key: string): Promise<boolean> {
    const exists = await this.redisService
      .getClient()
      .exists(this.buildKey(key));
    return exists === 1;
  }

  async forget(key: string): Promise<void> {
    await this.redisService.delete(this.buildKey(key));
  }

  private buildKey(key: string): string {
    return `${IDEMPOTENCY_NAMESPACE}:${key}`;
  }
}
