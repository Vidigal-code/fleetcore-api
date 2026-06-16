import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import type { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

import { MessagingService } from './messaging.service';
import { VehicleEventsConsumer } from './consumers/vehicle-events.consumer';
import { AppConfigService } from '../../shared/config/app-config.service';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
    RabbitMQModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService): RabbitMQConfig => {
        const {
          uri,
          exchange,
          connection,
          workerConcurrency,
          auditQueue,
          retryQueue,
          deadLetterQueue,
          retryDelayMs,
        } = configService.messaging;

        return {
          uri,
          prefetchCount: workerConcurrency,
          exchanges: [
            {
              name: exchange,
              type: 'topic',
            },
          ],
          // Retry/dead-letter topology for failed audit deliveries. A message
          // that cannot be persisted is dead-lettered to the retry queue, held
          // for `retryDelayMs`, then routed back to the audit queue for another
          // attempt. After the consumer exhausts its attempts it parks the
          // message in the dead-letter queue for manual inspection.
          queues: [
            {
              name: deadLetterQueue,
              createQueueIfNotExists: true,
              options: { durable: true },
            },
            {
              name: retryQueue,
              createQueueIfNotExists: true,
              options: {
                durable: true,
                arguments: {
                  'x-message-ttl': retryDelayMs,
                  'x-dead-letter-exchange': '',
                  'x-dead-letter-routing-key': auditQueue,
                },
              },
            },
          ],
          connectionInitOptions: {
            wait: true,
            timeout: connection.timeoutMs,
          },
          connectionManagerOptions: {
            reconnectTimeInSeconds: connection.reconnectSeconds,
            heartbeatIntervalInSeconds: connection.heartbeatSeconds,
          },
        } satisfies RabbitMQConfig;
      },
    }),
  ],
  providers: [MessagingService, VehicleEventsConsumer],
  exports: [MessagingService],
})
export class MessagingModule {}
