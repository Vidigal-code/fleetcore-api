# Backend Architecture

The backend is a NestJS 11 monorepo structured around Domain-Driven Design. Each capability lives in an isolated module, while the shared layer provides infrastructure primitives (config, caching, resilience, unit of work).

## High-level modules

| Module | Responsibilities | Key files |
|--------|------------------|-----------|
| `apps/api` | HTTP bootstrap, global guards (incl. dedicated `RateLimitGuard`), Swagger configuration, admin seeding | `backend/src/apps/api/api.module.ts`, `app-bootstrap.service.ts`, `security/` (rate-limit service/guard, sanitize pipe) |
| `modules/auth` | JWT issuance/validation, Redis-backed sessions with sliding TTL + lock/unlock, decorators and guards | `auth.controller.ts`, `auth.service.ts`, `application/auth-session.service.ts` (`refresh`/`lock`/`unlock`/`isLocked`), `strategies/jwt.strategy.ts` |
| `modules/fleet` | Aggregates, services and controllers for brands, models, vehicles | `fleet.module.ts`, `interfaces/http/*.controller.ts`, `application/*`, `domain/*`, `infrastructure/repositories/*` |
| `modules/messaging` | RabbitMQ integration using `@golevelup/nestjs-rabbitmq`, domain event publisher/consumer | `messaging.module.ts`, `messaging.service.ts`, `consumers/vehicle-events.consumer.ts` |
| `modules/audit` | HTTP interceptor, queue producer, MongoDB fallback writer, audit worker | `audit.interceptor.ts`, `audit.service.ts`, `audit-writer.service.ts`, `consumers/audit-events.consumer.ts` |
| `modules/users` | Admin seed, user repository abstractions, mapper, constants | `users.module.ts`, `users.service.ts`, `infrastructure/entities/user.orm-entity.ts` |
| `shared` | Application glue: configuration, env validation, feature toggles, metrics, cache, distributed lock, idempotency, resilience, unit of work | `shared/config/*.ts`, `resilience/resilience.service.ts`, `cache/repository-cache.service.ts`, `cache/redis-lock.service.ts`, `cache/idempotency.service.ts`, `unit-of-work/unit-of-work.ts` |

Two Nest applications run side by side:

- **API** (`backend/src/apps/api`) — exposes REST endpoints, guards (`JwtAuthGuard`, `RolesGuard`, `ThrottlerGuard`), branded bilingual Swagger (`/docs` en-US, `/docs-pt` pt-BR) and the audit interceptor.
- **Audit worker** (`backend/src/apps/audit-worker`) — processes audit messages asynchronously when feature toggles enable it. It consumes the `fleetcore.audit` queue, writes enriched events to MongoDB, and sizes its RabbitMQ `prefetchCount` from `WORKER_CONCURRENCY` (default `2`, logged at boot).

## Layered flow

1. **Interface layer**: controllers receive DTOs validated with `class-validator` and Zod-generated schemas (`backend/src/shared/validation`).
2. **Application layer**: services orchestrate domain logic, start transactions through `UnitOfWork`, interact with caches and publish domain events.
3. **Domain layer**: aggregates (`Brand`, `Model`, `Vehicle`, `User`) enforce invariants; events reside under `domain/events`.
4. **Infrastructure layer**: TypeORM repositories map aggregates to SQL Server tables; adapters talk to Redis, RabbitMQ and MongoDB.

## Cross-cutting concerns

- **Configuration**: strongly typed providers under `shared/config`; `AppConfigService` centralises access and is validated by `env.validation.ts`.
- **Authorization**: RBAC with `UserRole` (Admin / Operator); `@Roles()`, `@Public()` and `@CurrentUser()` decorators drive the global `JwtAuthGuard` + `RolesGuard`. Brand/model/vehicle mutations require the Admin role.
- **Resilience**: `ResilienceService` (cockatiel) wraps messaging/audit calls with retry, timeout and circuit breaker policies, and exposes `executeWithRetry`, `executeWithFallback` and `executeWithRollback` (compensations run in reverse order). `UnitOfWork` handles DB-level transactional rollback.
- **Database protection (Redis)**: critical operations are guarded by read cache (`RepositoryCacheService`), idempotency (`IdempotencyService` + `IdempotencyInterceptor`, `Idempotency-Key` header → `409` on duplicates), a distributed lock (`RedisLockService`, owner-token validated, `REDIS_LOCK_TTL`) and the dedicated `RateLimitGuard`.
- **Feature toggles**: `FeatureToggleService` reads `FEATURE_FLAGS_*` env vars to enable/disable repository cache, domain events, Swagger, async worker.
- **Metrics**: `DomainMetricsService` increments counters per event, ready for Prometheus/Grafana exporters.

## Request lifecycle example (vehicle update)

1. Request hits `vehicles.controller.ts` → `SanitizeInputPipe` cleans payload → guards validate JWT/session/role.
2. `VehiclesService` loads aggregates within a `UnitOfWork`, persists updates, invalidates Redis cache.
3. Domain events are emitted (`VehicleUpdatedEvent`), captured by `FleetDomainEventListener` and published via `MessagingService`.
4. `AuditInterceptor` records request/response metadata, queuing it for MongoDB storage.

This modularity keeps business rules isolated, allows targeted testing (unit vs. e2e), and makes the system resilient to downstream failures while remaining easy to extend with new bounded contexts.
