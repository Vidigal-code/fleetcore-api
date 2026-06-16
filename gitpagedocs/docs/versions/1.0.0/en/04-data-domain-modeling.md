# Data and Domain Modeling

The backend uses TypeORM on SQL Server with a pure DDD layer. Persistence is set up through a single migration (`backend/src/migrations/1717845600000-InitSchema.ts`) that defines tables, constraints and audit metadata (`created_at`, `updated_at`, `created_by`).

## Relational schema

| Table | Key columns | Relationships |
|-------|-------------|----------------|
| `users` | `id`, `nickname`, `email`, `password_hash`, `roles` | Seeded admin (`aivacol` / `aivacol123!`, via `UsersService.ensureAdminSeed`) with `UserRole` set (Admin / Operator); referenced by audit metadata. |
| `brands` | `id`, `name` | Unique constraint on `name`; optional parent for models. |
| `models` | `id`, `name`, `brand_id` | Foreign key to `brands` (SET NULL on delete) enabling orphan models. |
| `vehicles` | `id`, `license_plate`, `chassis`, `renavam`, `model_id` | Unique constraints on identifiers; cascade delete keeps referential integrity. |
| `audit_events` (Mongo) | `eventId`, `eventType`, `correlationId`, `requestId`, `userId`, `sessionId`, `method`, `route`, `statusCode`, `success`, `action`, `entity`, `entityId`, `actor`, `payload`, `metadata`, `occurredAt` + worker fields (`status='processed'`, `retries`, `sourceQueue`, `processedAt`) | Persisted by the async `audit-worker` from the `fleetcore.audit` queue; failed deliveries retry via `fleetcore.retry` and park in `fleetcore.dead-letter`. |
| `audit_outbox` (Mongo) | `routingKey`, `message`, `status` (`pending`/`processing`/`failed`), `attempts`, `lastError` | Publish-side fallback: when RabbitMQ is down `AuditService` stores events here; `AuditOutboxRelayService` (audit-worker) republishes them once the broker recovers. |

`backend/seeds/seed_vehicles.json` contains sample fleet data for local development.

## Aggregates and repositories

- **Aggregates**: `Brand`, `Model`, `Vehicle`, `User` live in `backend/src/modules/**/domain`. They enforce invariants such as unique brand names, valid license plates and role checks.
- **Repositories**: TypeORM repositories in `backend/src/modules/fleet/infrastructure/repositories` load/persist aggregates; interfaces reside in `domain/*.repository.ts`.
- **Unit of Work**: `backend/src/shared/unit-of-work/unit-of-work.ts` wraps TypeORM transactions, ensuring multiple repository operations stay atomic.
- **Domain events**: Emitted from aggregates (e.g. `VehicleCreatedEvent`, `VehicleUpdatedEvent`) and centralised under `backend/src/modules/fleet/domain/events`.

## Validation and schemas

- **Backend DTOs** use `class-validator` plus shared Zod schemas declared in `backend/src/shared/validation/fleet.schema.ts`.
- **Schema export**: `npm run export:schemas` generates JSON/Zod artefacts consumed by the frontend (`frontend/src/shared/schemas`).
- **Business rules**: plate regex, RENAVAM validation, chassis length and year bounds are defined once and reused by both API and UI layers.

## Patterns in practice

1. Controllers accept DTOs and hand them to application services.
2. Services load aggregates via repositories inside a `UnitOfWork` transaction.
3. Aggregates mutate state, emit domain events and hand persistence back to repositories.
4. Domain events fan out to caches, messaging and audit pipelines.

This structure keeps business rules close to the domain, minimises duplication across layers and allows the frontend to share the same validation rules as the API.
