import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  AUDIT_OUTBOX_STATUS_FAILED,
  AUDIT_OUTBOX_STATUS_PENDING,
  AUDIT_OUTBOX_STATUS_PROCESSING,
} from './audit.constants';
import {
  AuditOutbox,
  AuditOutboxDocument,
} from './schemas/audit-outbox.schema';

/**
 * Persistence layer for the audit transactional outbox. Writers (the API)
 * enqueue pending entries; the relay (the worker) claims, completes or parks
 * them. All Mongo access for the outbox is funneled through here.
 */
@Injectable()
export class AuditOutboxService {
  private readonly logger = new Logger(AuditOutboxService.name);

  constructor(
    @InjectModel(AuditOutbox.name)
    private readonly outboxModel: Model<AuditOutboxDocument>,
  ) {}

  /** Store an event that could not be published, for later relay. */
  async enqueue(
    routingKey: string,
    message: Record<string, unknown>,
  ): Promise<void> {
    await this.outboxModel.create({
      routingKey,
      message,
      status: AUDIT_OUTBOX_STATUS_PENDING,
      attempts: 0,
    });
  }

  /**
   * Atomically claim the oldest pending entry, flipping it to `processing` and
   * bumping its attempt counter. Returns null when nothing is pending.
   */
  async claimNext(): Promise<AuditOutboxDocument | null> {
    return this.outboxModel.findOneAndUpdate(
      { status: AUDIT_OUTBOX_STATUS_PENDING },
      {
        $set: { status: AUDIT_OUTBOX_STATUS_PROCESSING },
        $inc: { attempts: 1 },
      },
      { sort: { created_at: 1 }, new: true },
    );
  }

  /** Remove an entry that was successfully republished. */
  async markPublished(entry: AuditOutboxDocument): Promise<void> {
    await this.outboxModel.deleteOne({ _id: entry._id });
  }

  /**
   * Return an entry to `pending` for another attempt, or park it as `failed`
   * once it has exhausted `maxAttempts`.
   */
  async recordFailure(
    entry: AuditOutboxDocument,
    maxAttempts: number,
    error: unknown,
  ): Promise<void> {
    const exhausted = entry.attempts >= maxAttempts;
    const status = exhausted
      ? AUDIT_OUTBOX_STATUS_FAILED
      : AUDIT_OUTBOX_STATUS_PENDING;

    if (exhausted) {
      this.logger.error(
        `Audit outbox entry ${String(entry._id)} parked as failed after ${entry.attempts} attempts`,
      );
    }

    await this.outboxModel.updateOne(
      { _id: entry._id },
      {
        $set: {
          status,
          lastError: error instanceof Error ? error.message : String(error),
        },
      },
    );
  }

  /**
   * Reset entries stuck in `processing` (e.g. after a relay crash) back to
   * `pending`. Called on relay startup. Returns how many were requeued.
   */
  async requeueProcessing(): Promise<number> {
    const result = await this.outboxModel.updateMany(
      { status: AUDIT_OUTBOX_STATUS_PROCESSING },
      { $set: { status: AUDIT_OUTBOX_STATUS_PENDING } },
    );
    return result.modifiedCount ?? 0;
  }

  /** Count entries still awaiting relay (for observability). */
  async countPending(): Promise<number> {
    return this.outboxModel.countDocuments({
      status: AUDIT_OUTBOX_STATUS_PENDING,
    });
  }
}
