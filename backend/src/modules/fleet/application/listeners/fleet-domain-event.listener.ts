import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { EventBusService } from '../../../../shared/domain/events';
import { DomainMetricsService } from '../../../../shared/metrics/domain-metrics.service';
import { FeatureToggleService } from '../../../../shared/features';
import { MessagingService } from '../../../messaging/messaging.service';
import {
  BrandCreatedEvent,
  BrandDeletedEvent,
  BrandUpdatedEvent,
  ModelCreatedEvent,
  ModelDeletedEvent,
  ModelUpdatedEvent,
  VehicleCreatedEvent,
  VehicleDeletedEvent,
  VehicleUpdatedEvent,
} from '../../domain/events';
import {
  BRAND_EVENT_CREATED,
  BRAND_EVENT_REMOVED,
  BRAND_EVENT_UPDATED,
  MODEL_EVENT_CREATED,
  MODEL_EVENT_REMOVED,
  MODEL_EVENT_UPDATED,
  VEHICLE_EVENT_CREATED,
  VEHICLE_EVENT_REMOVED,
  VEHICLE_EVENT_UPDATED,
} from '../../fleet.constants';

type DomainEvents =
  | VehicleCreatedEvent
  | VehicleUpdatedEvent
  | VehicleDeletedEvent
  | BrandCreatedEvent
  | BrandUpdatedEvent
  | BrandDeletedEvent
  | ModelCreatedEvent
  | ModelUpdatedEvent
  | ModelDeletedEvent;

@Injectable()
export class FleetDomainEventListener implements OnModuleInit {
  private readonly logger = new Logger(FleetDomainEventListener.name);

  constructor(
    private readonly eventBus: EventBusService,
    private readonly messaging: MessagingService,
    private readonly metrics: DomainMetricsService,
    private readonly featureToggles: FeatureToggleService,
  ) {}

  onModuleInit() {
    const registrations: Array<
      [DomainEvents['name'], (event: DomainEvents) => Promise<void>]
    > = [
      [
        VEHICLE_EVENT_CREATED,
        (event) => this.forwardVehicleEvent(event as VehicleCreatedEvent),
      ],
      [
        VEHICLE_EVENT_UPDATED,
        (event) => this.forwardVehicleEvent(event as VehicleUpdatedEvent),
      ],
      [
        VEHICLE_EVENT_REMOVED,
        (event) => this.forwardVehicleEvent(event as VehicleDeletedEvent),
      ],
      [
        BRAND_EVENT_CREATED,
        (event) => this.forwardBrandEvent(event as BrandCreatedEvent),
      ],
      [
        BRAND_EVENT_UPDATED,
        (event) => this.forwardBrandEvent(event as BrandUpdatedEvent),
      ],
      [
        BRAND_EVENT_REMOVED,
        (event) => this.forwardBrandEvent(event as BrandDeletedEvent),
      ],
      [
        MODEL_EVENT_CREATED,
        (event) => this.forwardModelEvent(event as ModelCreatedEvent),
      ],
      [
        MODEL_EVENT_UPDATED,
        (event) => this.forwardModelEvent(event as ModelUpdatedEvent),
      ],
      [
        MODEL_EVENT_REMOVED,
        (event) => this.forwardModelEvent(event as ModelDeletedEvent),
      ],
    ];

    registrations.forEach(([name, handler]) => {
      this.eventBus.register(name, async (event) => {
        this.metrics.increment(event.name);
        await handler(event as DomainEvents);
      });
    });
  }

  private async forwardVehicleEvent(
    event: VehicleCreatedEvent | VehicleUpdatedEvent | VehicleDeletedEvent,
  ): Promise<void> {
    await this.dispatch(event, () => ({
      id: event.payload.vehicleId,
      licensePlate: event.payload.snapshot.licensePlate,
      modelId: event.payload.snapshot.modelId,
      actor: event.payload.actor,
      createdAt: event.payload.snapshot.createdAt.toISOString(),
      updatedAt: event.payload.snapshot.updatedAt.toISOString(),
      createdBy: event.payload.snapshot.createdBy,
    }));
  }

  private async forwardBrandEvent(
    event: BrandCreatedEvent | BrandUpdatedEvent | BrandDeletedEvent,
  ): Promise<void> {
    await this.dispatch(event, () => ({
      id: event.payload.brandId,
      name: event.payload.snapshot.name,
      actor: event.payload.actor,
      createdAt: event.payload.snapshot.createdAt.toISOString(),
      updatedAt: event.payload.snapshot.updatedAt.toISOString(),
      createdBy: event.payload.snapshot.createdBy,
    }));
  }

  private async forwardModelEvent(
    event: ModelCreatedEvent | ModelUpdatedEvent | ModelDeletedEvent,
  ): Promise<void> {
    await this.dispatch(event, () => ({
      id: event.payload.modelId,
      name: event.payload.snapshot.name,
      brandId: event.payload.snapshot.brandId,
      actor: event.payload.actor,
      createdAt: event.payload.snapshot.createdAt.toISOString(),
      updatedAt: event.payload.snapshot.updatedAt.toISOString(),
      createdBy: event.payload.snapshot.createdBy,
    }));
  }

  private async dispatch(
    event: DomainEvents,
    payloadFactory: () => Record<string, unknown>,
  ) {
    if (!this.featureToggles.isEnabled('domainEvents', true)) {
      this.logger.debug(
        `Domain event forwarding disabled, skipping ${event.name}`,
      );
      return;
    }

    const metadata = payloadFactory();

    try {
      await this.messaging.publish(event.name, {
        event: event.name,
        ...metadata,
      });
    } catch (error) {
      this.logger.error(
        `Failed to forward domain event ${event.name}`,
        error as Error,
      );
    }
  }
}
