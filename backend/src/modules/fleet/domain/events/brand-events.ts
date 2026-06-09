import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';
import type { Brand } from '../brand.aggregate';

interface BrandEventPayload {
  readonly brandId: string;
  readonly actor: string;
  readonly snapshot: Brand;
}

export class BrandCreatedEvent extends BaseDomainEvent<BrandEventPayload> {
  constructor(payload: BrandEventPayload) {
    super('brand.created', payload);
  }
}

export class BrandUpdatedEvent extends BaseDomainEvent<BrandEventPayload> {
  constructor(payload: BrandEventPayload) {
    super('brand.updated', payload);
  }
}

export class BrandDeletedEvent extends BaseDomainEvent<BrandEventPayload> {
  constructor(payload: BrandEventPayload) {
    super('brand.removed', payload);
  }
}
