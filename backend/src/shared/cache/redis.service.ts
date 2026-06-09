import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get('redis.host'),
      port: this.configService.get('redis.port'),
    });
  }

  getClient() {
    return this.client;
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async delete(key: string) {
    await this.client.del(key);
  }

  async deleteByPattern(pattern: string) {
    const stream = this.client.scanStream({ match: pattern });
    const keys: string[] = [];

    return new Promise<void>((resolve, reject) => {
      stream.on('data', (resultKeys: string[]) => {
        for (const key of resultKeys) {
          keys.push(key);
        }
      });

      stream.on('end', () => {
        if (keys.length === 0) {
          resolve();
          return;
        }

        this.client
          .del(...keys)
          .then(() => resolve())
          .catch(reject);
      });

      stream.on('error', (error) => reject(error));
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
