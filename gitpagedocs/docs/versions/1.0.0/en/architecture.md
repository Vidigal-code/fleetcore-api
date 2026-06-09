# Architecture

Snapshot of how the backend, domain and support services fit together.

## NestJS backend

- Modular structure (`auth`, `fleet`, `users`, `audit`, `messaging`).
- Global guards (`JwtAuthGuard`, `RolesGuard`) and Redis-backed `AuthSessionService`.
- Domain events flowing through `FleetDomainEventListener` into RabbitMQ.

Read [Backend Architecture](./03-backend-architecture.md) for the full breakdown.

## Modeling & persistence

- TypeORM entities managed through a single migration (`1717845600000-InitSchema.ts`).
- Aggregates enforce invariants with transactional `UnitOfWork` support.
- Seeds (`UsersService.ensureAdminSeed`) and vehicle dataset prime the environment.

See [Data and Domain Modeling](./04-data-domain-modeling.md) for details.

## Observability

- Audit interceptor writes to MongoDB while publishing to RabbitMQ.
- Domain metrics expose counters for monitoring.
- `ResilienceService` and feature toggles manage retries, timeouts and optional behaviours.

The full narrative lives in [Security, Audit and Messaging](./05-security-audit-messaging.md).
