import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

import { AppConfigService } from '../../shared/config/app-config.service';
import type { ResiliencePolicyConfig } from '../../shared/config/app-config.types';
import { ResilienceService } from '../../shared/resilience/resilience.service';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);
  private readonly exchange: string;
  private readonly resiliencePolicy: ResiliencePolicyConfig;

  constructor(
    private readonly amqp: AmqpConnection,
    configService: AppConfigService,
    private readonly resilience: ResilienceService,
  ) {
    const messaging = configService.messaging;
    this.exchange = messaging.exchange;
    this.resiliencePolicy = this.resilience.getDefaultMessagingPolicy();
  }

  async publish(event: string, payload: Record<string, unknown>) {
    try {
      await this.resilience.execute(
        () => this.amqp.publish(this.exchange, event, payload),
        {
          name: `messaging:${event}`,
          retry: this.resiliencePolicy.retry,
          circuitBreaker: this.resiliencePolicy.circuitBreaker,
        },
      );
    } catch (error) {
      this.logger.error(`Failed to publish event ${event}`, error as Error);
      throw error;
    }
  }
}
