import { createHash } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { RedisService } from './redis.service';

const repositoryCacheReplacer = (_: string, value: unknown) => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
};

interface CacheFetchOptions<T> {
  readonly namespace: string;
  readonly key: unknown;
  readonly ttlSeconds: number;
  readonly loader: () => Promise<T>;
  readonly serializer?: (value: T) => string;
  readonly deserializer?: (raw: string) => T;
}

@Injectable()
export class RepositoryCacheService {
  constructor(private readonly redis: RedisService) {}

  async fetch<T>({
    namespace,
    key,
    ttlSeconds,
    loader,
    serializer = JSON.stringify,
    deserializer = (raw) => JSON.parse(raw) as T,
  }: CacheFetchOptions<T>): Promise<T> {
    const cacheKey = this.buildKey(namespace, key);
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return deserializer(cached);
    }

    const value = await loader();
    await this.redis.set(cacheKey, serializer(value), ttlSeconds);
    return value;
  }

  async invalidate(namespace: string): Promise<void> {
    await this.redis.deleteByPattern(`${namespace}:*`);
  }

  private buildKey(namespace: string, key: unknown): string {
    if (typeof key === 'string') {
      return `${namespace}:${key}`;
    }

    const hash = createHash('sha1')
      .update(JSON.stringify(key, repositoryCacheReplacer, 2))
      .digest('hex');
    return `${namespace}:${hash}`;
  }
}
