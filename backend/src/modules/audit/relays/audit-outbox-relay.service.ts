import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';

import { MessagingService } from '../../messaging/messaging.service';
import { AuditOutboxService } from '../audit-outbox.service';
import {
  AUDIT_OUTBOX_BATCH_SIZE,
  AUDIT_OUTBOX_MAX_ATTEMPTS,
  AUDIT_OUTBOX_RELAY_INTERVAL_MS,
} from '../audit.constants';

const toInteger = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

/**
 * Background relay for the audit transactional outbox. On a fixed interval it
 * republishes pending entries to RabbitMQ; once the broker is back, the normal
 * audit pipeline (consumer → Mongo) takes over. Runs in the audit-worker only.
 */
@Injectable()
export class AuditOutboxRelayService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(AuditOutboxRelayService.name);
  private readonly intervalMs = toInteger(
    process.env.AUDIT_OUTBOX_RELAY_INTERVAL_MS,
    AUDIT_OUTBOX_RELAY_INTERVAL_MS,
  );
  private readonly batchSize = toInteger(
    process.env.AUDIT_OUTBOX_BATCH_SIZE,
    AUDIT_OUTBOX_BATCH_SIZE,
  );
  private readonly maxAttempts = toInteger(
    process.env.AUDIT_OUTBOX_MAX_ATTEMPTS,
    AUDIT_OUTBOX_MAX_ATTEMPTS,
  );

  private timer?: NodeJS.Timeout;
  private draining = false;

  constructor(
    private readonly outbox: AuditOutboxService,
    private readonly messaging: MessagingService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const requeued = await this.outbox.requeueProcessing();
    if (requeued > 0) {
      this.logger.warn(
        `Requeued ${requeued} in-flight outbox entries left over from a previous run`,
      );
    }

    this.timer = setInterval(() => {
      void this.drain();
    }, this.intervalMs);
    // Do not keep the process alive solely for the relay timer.
    this.timer.unref();

    this.logger.log(
      `Audit outbox relay started (interval=${this.intervalMs}ms, batch=${this.batchSize}, maxAttempts=${this.maxAttempts})`,
    );
  }

  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  /**
   * Drain up to `batchSize` pending entries. Entries are claimed one at a time
   * so a publish failure (broker still down) leaves the rest untouched; the
   * loop stops early on the first failure to avoid hammering a dead broker.
   */
  private async drain(): Promise<void> {
    if (this.draining) {
      return;
    }
    this.draining = true;

    try {
      let relayed = 0;
      for (let i = 0; i < this.batchSize; i += 1) {
        const entry = await this.outbox.claimNext();
        if (!entry) {
          break;
        }

        try {
          await this.messaging.publish(entry.routingKey, entry.message);
          await this.outbox.markPublished(entry);
          relayed += 1;
        } catch (error) {
          await this.outbox.recordFailure(entry, this.maxAttempts, error);
          // Broker is likely still unavailable; retry on the next tick.
          break;
        }
      }

      if (relayed > 0) {
        this.logger.log(`Relayed ${relayed} audit event(s) from the outbox`);
      }
    } catch (error) {
      this.logger.error('Audit outbox relay tick failed', error as Error);
    } finally {
      this.draining = false;
    }
  }
}
