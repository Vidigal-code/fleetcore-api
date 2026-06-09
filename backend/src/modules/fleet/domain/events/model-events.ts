import { BaseDomainEvent } from '../../../../shared/domain/events';
import type { Model } from '../model.aggregate';

interface ModelEventPayload {
  readonly modelId: string;
  readonly actor: string;
  readonly snapshot: Model;
}

export class ModelCreatedEvent extends BaseDomainEvent<ModelEventPayload> {
  constructor(payload: ModelEventPayload) {
    super('model.created', payload);
  }
}

export class ModelUpdatedEvent extends BaseDomainEvent<ModelEventPayload> {
  constructor(payload: ModelEventPayload) {
    super('model.updated', payload);
  }
}

export class ModelDeletedEvent extends BaseDomainEvent<ModelEventPayload> {
  constructor(payload: ModelEventPayload) {
    super('model.removed', payload);
  }
}
