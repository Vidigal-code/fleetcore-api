import { Injectable, Logger } from '@nestjs/common';

import type { DomainEvent } from './domain-event';

type DomainEventHandler<T extends DomainEvent = DomainEvent> = (
  event: T,
) => Promise<void> | void;

@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);
  private readonly handlers = new Map<string, DomainEventHandler[]>();

  register<T extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<T>,
  ) {
    const existing = this.handlers.get(eventName) ?? [];
    this.handlers.set(eventName, [...existing, handler]);
  }

  async publish(event: DomainEvent) {
    const handlers = this.handlers.get(event.name) ?? [];
    if (handlers.length === 0) {
      this.logger.debug(`No listeners registered for event ${event.name}`);
      return;
    }

    await Promise.all(
      handlers.map(async (handler) => {
        await Promise.resolve(handler(event));
      }),
    );
  }
}
