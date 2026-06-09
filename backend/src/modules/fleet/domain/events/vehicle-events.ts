import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';
import type { Vehicle } from '../vehicle.aggregate';

interface VehicleEventPayload {
  readonly vehicleId: string;
  readonly actor: string;
  readonly snapshot: Vehicle;
}

export class VehicleCreatedEvent extends BaseDomainEvent<VehicleEventPayload> {
  constructor(payload: VehicleEventPayload) {
    super('vehicle.created', payload);
  }
}

export class VehicleUpdatedEvent extends BaseDomainEvent<VehicleEventPayload> {
  constructor(payload: VehicleEventPayload) {
    super('vehicle.updated', payload);
  }
}

export class VehicleDeletedEvent extends BaseDomainEvent<VehicleEventPayload> {
  constructor(payload: VehicleEventPayload) {
    super('vehicle.removed', payload);
  }
}
