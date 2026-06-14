import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { AppConfigService } from '../config/app-config.service';
import { RedisService } from './redis.service';

const LOCK_NAMESPACE = 'lock';

// Compare-and-delete: only the owner token may release the lock.
const RELEASE_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end`;

// Compare-and-expire: only the owner token may extend the lock TTL.
const RENEW_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("pexpire", KEYS[1], ARGV[2])
else
  return 0
end`;

export interface LockHandle {
  readonly resource: string;
  readonly token: string;
}

@Injectable()
export class RedisLockService {
  private readonly defaultTtlSeconds: number;

  constructor(
    private readonly redisService: RedisService,
    appConfigService: AppConfigService,
  ) {
    this.defaultTtlSeconds = appConfigService.redis.lockTtlSeconds;
  }

  async acquireLock(
    resource: string,
    ttlSeconds = this.defaultTtlSeconds,
  ): Promise<LockHandle | null> {
    const token = randomUUID();
    const result = await this.redisService
      .getClient()
      .set(this.buildKey(resource), token, 'EX', ttlSeconds, 'NX');
    return result === 'OK' ? { resource, token } : null;
  }

  async releaseLock(handle: LockHandle): Promise<boolean> {
    const released = await this.redisService
      .getClient()
      .eval(RELEASE_SCRIPT, 1, this.buildKey(handle.resource), handle.token);
    return released === 1;
  }

  async renewLock(
    handle: LockHandle,
    ttlSeconds = this.defaultTtlSeconds,
  ): Promise<boolean> {
    const renewed = await this.redisService
      .getClient()
      .eval(
        RENEW_SCRIPT,
        1,
        this.buildKey(handle.resource),
        handle.token,
        `${ttlSeconds * 1000}`,
      );
    return renewed === 1;
  }

  /**
   * Runs the callback while holding a distributed lock on the resource and
   * always releases it afterwards. Throws if the lock cannot be acquired.
   */
  async withLock<T>(
    resource: string,
    callback: () => Promise<T>,
    ttlSeconds = this.defaultTtlSeconds,
  ): Promise<T> {
    const handle = await this.acquireLock(resource, ttlSeconds);
    if (!handle) {
      throw new Error(`Could not acquire lock for resource "${resource}"`);
    }

    try {
      return await callback();
    } finally {
      await this.releaseLock(handle);
    }
  }

  private buildKey(resource: string): string {
    return `${LOCK_NAMESPACE}:${resource}`;
  }
}
