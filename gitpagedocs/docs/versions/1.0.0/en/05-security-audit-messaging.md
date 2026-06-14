# Security, Audit and Messaging

Security, observability and integrations are implemented end-to-end so the platform remains trustworthy in production. JWT sessions, audit logging and RabbitMQ messaging operate together while remaining configurable through feature flags. The latest iteration adds Redis-backed session locking with a sliding TTL, a distributed lock, idempotency, a dedicated rate-limit guard, enriched auditing and stronger retry/fallback/rollback helpers — all **additive**: the existing structure and request flow were preserved.

## Authentication and authorization

- **Endpoints**: `POST /auth/login`, `POST /auth/register`, `POST /auth/logout` and `GET /auth/me` handled by `backend/src/modules/auth/interfaces/http/auth.controller.ts`.
- **JWT strategy**: `JwtStrategy` validates tokens and checks Redis session state before allowing access. On every valid request it **refreshes the session TTL (sliding expiration)** and **rejects locked sessions with `401`**.
- **Session storage**: `AuthSessionService` (`backend/src/modules/auth/application/auth-session.service.ts`) keeps the active session **only in Redis**; MongoDB stores audit history only. It exposes `store`, `revoke`, `isActive`, plus the new `refresh()` (renews TTL — sliding), `lock()`, `unlock()` and `isLocked()`. Keys: `auth.sessions:{sessionId}` and `auth.sessions.lock:{sessionId}`. TTL comes from `AUTH_SESSION_TTL_SECONDS`. Logout and password changes revoke tokens immediately.
- **Guards and decorators**: global `JwtAuthGuard` + `RolesGuard`; `@Roles()`, `@Public()` and `@CurrentUser()` gate endpoints. RBAC uses `UserRole` (Admin / Operator) — brand/model/vehicle mutations require Admin. A dedicated `RateLimitGuard` and `SanitizeInputPipe` live under `backend/src/apps/api/security/`; helmet hardens HTTP headers.

## Database protection with Redis

Critical operations are wrapped by a set of Redis-backed protections under `backend/src/shared/cache`:

- **Read cache**: `RepositoryCacheService.fetch()` / `invalidate()` serve and refresh cached query results.
- **Idempotency**: `IdempotencyService` (`markIdempotencyKey` / `isDuplicate`) together with `IdempotencyInterceptor` read the `Idempotency-Key` header on mutating requests and return `409` on duplicates.
- **Distributed lock**: `RedisLockService` (`backend/src/shared/cache/redis-lock.service.ts`) provides `acquireLock` (`SET NX EX`), `releaseLock` (Lua compare-and-del that validates the owner token), `renewLock` (Lua compare-and-pexpire) and a `withLock` helper. The owner-token check prevents foreign unlocks, and the TTL (`REDIS_LOCK_TTL`, default `30s`) prevents deadlocks.
- **Rate limit**: the dedicated guard described below.

## Rate limiting

- **Dedicated Redis guard**: `RateLimitService` + global `RateLimitGuard` (`backend/src/apps/api/security/`) count requests per user, IP and endpoint using keys `ratelimit:user:{id}`, `ratelimit:ip:{ip}` and `ratelimit:endpoint:{route}`.
- **Limits**: default `100` requests / `60s`; `POST /auth/login` is tightened to `10` / `60s` via the `@AuthRateLimit()` decorator.
- **Response**: when exceeded, a `429` JSON body is returned: `{ "success": false, "message": "Rate limit exceeded", "retryAfter": <seconds> }`.
- **Auditing**: blocked attempts are audited with eventType `rate_limit.blocked`.
- The base `@nestjs/throttler` guard remains in place. Tunable via `RATE_LIMIT_ENABLED`, `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_AUTH_MAX_REQUESTS` and `RATE_LIMIT_AUTH_WINDOW_SECONDS`.

## Audit trail

- **Interceptor**: `backend/src/modules/audit/interceptors/audit.interceptor.ts` audits **every non-public route** and emits structured events. Each event is now enriched with `eventId`, `eventType`, `correlationId`, `requestId`, `userId`, `sessionId`, `method`, `route`, `statusCode` and `success`, in addition to the existing `action`, `entity`, `entityId`, `actor`, `payload`, `metadata` and `occurredAt`.
- **Queue publishing**: `AuditService` publishes payloads to RabbitMQ on the `fleetcore.audit` queue with routing key `audit.event`.
- **Async worker & writer**: `backend/src/apps/audit-worker` consumes audit messages and persists them to the MongoDB `audit_events` collection; a synchronous fallback writes directly to MongoDB when the queue is disabled or unavailable. The schema (`backend/src/modules/audit/schemas/audit-event.schema.ts`) carries the enriched fields plus worker processing metadata: `status='processed'`, `retries`, `sourceQueue` and `processedAt`. Persistence runs through `ResilienceService` (retry/fallback).

## Messaging

- **Domain events**: Fleet services emit events defined under `backend/src/modules/fleet/domain/events`.
- **Listener**: `FleetDomainEventListener` collects events and forwards them to `MessagingService` if `FEATURE_FLAGS_DOMAIN_EVENTS` is true.
- **Publisher & consumers**: `MessagingService` publishes to the topic exchange `fleetcore.events` (`RABBITMQ_EXCHANGE`); the `vehicle-events` and `audit-events` consumers process deliveries and act as blueprints for downstream integrations.
- **Resilience**: All RabbitMQ calls run through `ResilienceService` (cockatiel retry, circuit breaker, timeout) to avoid cascading failures. The service now also offers `executeWithRetry`, `executeWithFallback` (controlled error → fallback) and `executeWithRollback` (runs steps and, on failure, executes compensations in reverse order). `UnitOfWork` remains the database-level transactional rollback.
- **Worker concurrency**: `WORKER_CONCURRENCY` (default `2`) drives the RabbitMQ `prefetchCount`; the `audit-worker` app logs the configured concurrency at boot. Retry/dead-letter routing uses `RABBITMQ_RETRY_QUEUE` (`fleetcore.retry`) and `RABBITMQ_DLQ` (`fleetcore.dead-letter`).

## Observability and controls

- **Metrics**: `DomainMetricsService` tracks counts per event enabling Prometheus/Grafana exporters.
- **Structured logging**: Nest `Logger` captures audit fallbacks, messaging retries and guard denials.
- **Feature toggles**: `FeatureToggleService` reads env flags (e.g. `FEATURE_FLAGS_REPOSITORY_CACHE`, `FEATURE_FLAGS_AUDIT_ASYNC_WORKER`, `FEATURE_FLAGS_DOMAIN_EVENTS`) to enable or disable integrations without code changes.

With this setup the platform can revoke specific sessions, trace every mutating request, replay audit records and integrate with other services through RabbitMQ while remaining resilient to infrastructure hiccups.
