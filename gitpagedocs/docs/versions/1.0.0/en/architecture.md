# Architecture

Snapshot of how the backend, domain and support services fit together.

## NestJS backend

- Modular structure (`auth`, `fleet`, `users`, `audit`, `messaging`).
- Global guards (`JwtAuthGuard`, `RolesGuard`, dedicated `RateLimitGuard`) with RBAC (`UserRole` = Admin / Operator) and Redis-backed `AuthSessionService` (sliding TTL + lock/unlock).
- Redis-backed protections for critical operations: read cache, idempotency (`IdempotencyService`), distributed lock (`RedisLockService`) and per user/IP/endpoint rate limiting.
- Domain events flowing through `FleetDomainEventListener` into RabbitMQ.

Refer to the Backend Architecture section in the menu for the full breakdown.

## Modeling & persistence

- TypeORM entities managed through a single migration (`1717845600000-InitSchema.ts`).
- Aggregates enforce invariants with transactional `UnitOfWork` support.
- Seeds (`UsersService.ensureAdminSeed`) and vehicle dataset prime the environment.

See the Data and Domain Modeling section for details.

## Observability

- Audit interceptor enriches every non-public request (eventId, correlationId, requestId, sessionId, route, statusCode, success...) and publishes to RabbitMQ (`fleetcore.audit`); the async `audit-worker` persists to MongoDB with processing metadata (`status`, `retries`, `processedAt`).
- Domain metrics expose counters for monitoring.
- `ResilienceService` (retry/fallback/rollback) and feature toggles manage retries, timeouts and optional behaviours; `WORKER_CONCURRENCY` sizes the worker prefetch.

The full narrative lives in the Security, Audit and Messaging section.
