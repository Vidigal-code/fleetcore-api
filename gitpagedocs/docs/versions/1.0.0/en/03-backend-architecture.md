# Backend Architecture

The backend relies on **NestJS 11** with a modular, domain-driven design. Responsibility boundaries are kept sharp, making the codebase maintainable and highly testable.

## Module overview

- `apps/api` — HTTP bootstrap; registers global guards (`JwtAuthGuard`, `RolesGuard`, `ThrottlerGuard`) and the audit interceptor.
- `modules/auth` — authentication, JWT issuing/validation, `AuthSessionService` (Redis) and HTTP endpoints (`login`, `register`, `logout`, `me`).
- `modules/fleet` — fleet domain (brands, models, vehicles) with services, aggregates and domain events.
- `modules/audit` — interceptors, audit service and MongoDB writer (`AuditWriterService`).
- `modules/messaging` — RabbitMQ integration via `@golevelup/nestjs-rabbitmq` plus the vehicle events consumer.
- `modules/users` — admin seed (`aivacol`) and user repository operations.
- `shared` — cross-cutting concerns (cache, feature toggles, unit of work, metrics, resilience, config objects).

## Layered approach

1. **Interface**: controllers + DTOs (e.g. `vehicles.controller.ts`) validate requests with `class-validator` and Zod-derived schemas.
2. **Application**: services (e.g. `vehicles.service.ts`) orchestrate rules, transactions (`UnitOfWork`), auditing and domain events.
3. **Domain**: aggregates (`Vehicle`, `Model`, `Brand`) ensure invariants, while events (`VehicleCreatedEvent`) capture snapshots.
4. **Infrastructure**: TypeORM repositories convert aggregates to persistence entities; adapters encapsulate Redis/Mongo/RabbitMQ.

## Resilience & feature flags

- `ResilienceService` provides retry, circuit breaker and timeout policies for outbound calls (messaging/audit).
- `FeatureToggleService` reads flags (`auditAsyncWorker`, `domainEvents`, `repositoryCache`, `swaggerDocs`) so behaviours can be toggled per environment.
- `DomainMetricsService` increments counters per published event.

## Request flow

1. Request enters the pipeline → sanitized by `SanitizeInputPipe` → authenticated/authorized by guards.
2. Controller delegates to the appropriate service; `UnitOfWork` executes transactional logic.
3. Service persists aggregates, records audit events, invalidates Redis cache and raises domain events.
4. `FleetDomainEventListener` reacts to domain events, increments metrics and forwards payloads to RabbitMQ when enabled.

## Configuration

Typed config files under `shared/config` (`app`, `database`, `redis`, `jwt`, `auth`, `audit`, `messaging`, `swagger`, `feature-toggle`, `resilience`) consolidate environment variables. `AppConfigService` exposes getters with safe defaults validated by `env.validation.ts`.

## Why it works for the challenge

- Scales horizontally (stateless API + Redis + RabbitMQ).
- Keeps domain logic isolated from infrastructure details.
- Enables fine-grained testing (services injected via DI; e2e covers real HTTP flows using SQLite in memory).
- Adds resilience hooks for unreliable external services.
