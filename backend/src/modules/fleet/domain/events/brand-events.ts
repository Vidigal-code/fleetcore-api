import { BaseDomainEvent } from '../../../../shared/domain/events';
import {
  BRAND_EVENT_CREATED,
  BRAND_EVENT_REMOVED,
  BRAND_EVENT_UPDATED,
} from '../../fleet.constants';
import type { Brand } from '../brand.aggregate';

interface BrandEventPayload {
  readonly brandId: string;
  readonly actor: string;
  readonly snapshot: Brand;
}

export class BrandCreatedEvent extends BaseDomainEvent<BrandEventPayload> {
  constructor(payload: BrandEventPayload) {
    super(BRAND_EVENT_CREATED, payload);
  }
}

export class BrandUpdatedEvent extends BaseDomainEvent<BrandEventPayload> {
  constructor(payload: BrandEventPayload) {
    super(BRAND_EVENT_UPDATED, payload);
  }
}

export class BrandDeletedEvent extends BaseDomainEvent<BrandEventPayload> {
  constructor(payload: BrandEventPayload) {
    super(BRAND_EVENT_REMOVED, payload);
  }
}
