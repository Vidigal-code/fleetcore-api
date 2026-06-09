# Back-end

Quick reference to the NestJS API surface, business rules and supporting mechanisms.

## Core endpoints

- Brand, model and vehicle CRUD under `fleet/interfaces/http`.
- Auth routes (`/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me`).
- Swagger available at `/docs` (EN) and `/docs-pt` (PT-BR).

## Business rules

- Services (`models.service.ts`, `vehicles.service.ts`) validate relationships and emit domain events.
- Redis cache accelerates search endpoints with automatic invalidation after mutations.
- RabbitMQ propagates domain changes to downstream consumers.

## Deep dives

- [Backend Architecture](./03-backend-architecture.md) — modules and layering.
- [Data and Domain Modeling](./04-data-domain-modeling.md) — entities, aggregates, migrations.
- [Security, Audit and Messaging](./05-security-audit-messaging.md) — guards, audit trail, messaging.
