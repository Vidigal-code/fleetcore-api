import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class VehicleEventsConsumer {
  private readonly logger = new Logger(VehicleEventsConsumer.name);

  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_EXCHANGE ?? 'fleetcore.events',
    routingKey: 'vehicle.*',
    queue: process.env.RABBITMQ_QUEUE ?? 'fleetcore.vehicles',
  })
  handleVehicleEvents(message: Record<string, unknown>) {
    this.logger.debug(`Received vehicle event: ${JSON.stringify(message)}`);
  }
}
