export interface DomainEvent<TPayload = unknown> {
  readonly name: string;
  readonly occurredAt: Date;
  readonly payload: TPayload;
}

export abstract class BaseDomainEvent<TPayload = unknown>
  implements DomainEvent<TPayload>
{
  readonly occurredAt = new Date();

  protected constructor(
    public readonly name: string,
    public readonly payload: TPayload,
  ) {}
}
