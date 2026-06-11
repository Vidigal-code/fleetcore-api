# Back-end

Quick reference to the NestJS API surface, business rules and supporting mechanisms.

## Core endpoints

- Brand, model and vehicle CRUD under `fleet/interfaces/http`.
- Auth routes (`/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me`).
- Branded bilingual Swagger at `/docs` (en-US) and `/docs-pt` (pt-BR): dark Fleetcore theme, Try-it-out enabled, bilingual DTO examples and a `POST /auth/login` body pre-filled with the seed credentials (`aivacol` / `aivacol123!`).

## Business rules

- Services (`models.service.ts`, `vehicles.service.ts`) validate relationships and emit domain events.
- Redis cache accelerates search endpoints with automatic invalidation after mutations.
- RabbitMQ propagates domain changes to downstream consumers.

## Deep dives

- **Backend Architecture** — modules and layering documented in the dedicated section.
- **Data and Domain Modeling** — entities, aggregates, migrations.
- **Security, Audit and Messaging** — guards, audit trail, messaging.
