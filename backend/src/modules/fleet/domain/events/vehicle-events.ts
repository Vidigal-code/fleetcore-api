import { BaseDomainEvent } from '../../../../shared/domain/events';
import {
  VEHICLE_EVENT_CREATED,
  VEHICLE_EVENT_REMOVED,
  VEHICLE_EVENT_UPDATED,
} from '../../fleet.constants';
import type { Vehicle } from '../vehicle.aggregate';

interface VehicleEventPayload {
  readonly vehicleId: string;
  readonly actor: string;
  readonly snapshot: Vehicle;
}

export class VehicleCreatedEvent extends BaseDomainEvent<VehicleEventPayload> {
  constructor(payload: VehicleEventPayload) {
    super(VEHICLE_EVENT_CREATED, payload);
  }
}

export class VehicleUpdatedEvent extends BaseDomainEvent<VehicleEventPayload> {
  constructor(payload: VehicleEventPayload) {
    super(VEHICLE_EVENT_UPDATED, payload);
  }
}

export class VehicleDeletedEvent extends BaseDomainEvent<VehicleEventPayload> {
  constructor(payload: VehicleEventPayload) {
    super(VEHICLE_EVENT_REMOVED, payload);
  }
}
