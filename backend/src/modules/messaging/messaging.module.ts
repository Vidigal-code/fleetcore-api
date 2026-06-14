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
        const { uri, exchange, connection, workerConcurrency } =
          configService.messaging;

        return {
          uri,
          prefetchCount: workerConcurrency,
          exchanges: [
            {
              name: exchange,
              type: 'topic',
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
