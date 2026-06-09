# Data and Domain Modeling

The system relies on **TypeORM** with SQL Server. A single migration (`backend/src/migrations/1717845600000-InitSchema.ts`) provisions every required table and metadata column (`created_at`, `updated_at`, `created_by`).

## Database tables

| Table | Key columns | Notes |
|-------|-------------|-------|
| `users` | `id`, `nickname`, `name`, `email`, `password_hash`, `roles`, metadata | Seeds admin `aivacol`; roles stored as CSV. |
| `brands` | `id`, `name`, metadata | Unique constraint on `name`. |
| `models` | `id`, `name`, `brand_id`, metadata | `brand_id` optional; FK uses `SET NULL`. |
| `vehicles` | `id`, `license_plate`, `chassis`, `renavam`, `year`, `model_id`, metadata | Unique constraints on plate/chassis/renavam; FK cascades deletions to keep referential integrity. |

## Domain layer

- Aggregates (`User`, `Brand`, `Model`, `Vehicle`) encapsulate invariants and provide mutation methods with guarded state transitions.
- Domain events (`VehicleCreatedEvent`, etc.) carry snapshots for messaging and auditing.

## Validation pipeline

- DTOs rely on `class-validator` plus Zod schemas generated from the backend and consumed by the frontend (`backend/scripts/export-schemas.ts`).
- Critical rules (Mercosur plate regex, chassis length, RENAVAM structure) are defined once in `backend/src/shared/validation/fleet.schema.ts`.

## Repositories & Unit of Work

- Custom repositories (`VehicleTypeOrmRepository`, `ModelTypeOrmRepository`, ...) translate aggregates to persistence rows.
- `UnitOfWork` wraps `EntityManager.transaction()` so complex operations (create/update/delete) stay atomic.

## Seeds and sample data

- `UsersService.ensureAdminSeed()` provisions the administrator on bootstrap.
- `backend/seeds/seed_vehicles.json` delivers the mock dataset requested by the challenge.

## Compliance

- Required tables (`models`, `vehicles`) plus bonus tables (`brands`, `users`) are present.
- Integrity rules ensure consistent data and reduce duplication.
- Domain objects keep business rules close to the core, easing testing and future evolution.
