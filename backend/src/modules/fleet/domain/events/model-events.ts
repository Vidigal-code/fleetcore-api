import { BaseDomainEvent } from '../../../../shared/domain/events';
import {
  MODEL_EVENT_CREATED,
  MODEL_EVENT_REMOVED,
  MODEL_EVENT_UPDATED,
} from '../../fleet.constants';
import type { Model } from '../model.aggregate';

interface ModelEventPayload {
  readonly modelId: string;
  readonly actor: string;
  readonly snapshot: Model;
}

export class ModelCreatedEvent extends BaseDomainEvent<ModelEventPayload> {
  constructor(payload: ModelEventPayload) {
    super(MODEL_EVENT_CREATED, payload);
  }
}

export class ModelUpdatedEvent extends BaseDomainEvent<ModelEventPayload> {
  constructor(payload: ModelEventPayload) {
    super(MODEL_EVENT_UPDATED, payload);
  }
}

export class ModelDeletedEvent extends BaseDomainEvent<ModelEventPayload> {
  constructor(payload: ModelEventPayload) {
    super(MODEL_EVENT_REMOVED, payload);
  }
}
