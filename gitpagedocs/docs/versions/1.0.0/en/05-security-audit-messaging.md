# Security, Audit and Messaging

Security, observability and integrations are implemented end-to-end so the platform remains trustworthy in production. JWT sessions, audit logging and RabbitMQ messaging operate together while remaining configurable through feature flags.

## Authentication and authorization

- **Endpoints**: `POST /auth/login`, `POST /auth/register`, `POST /auth/logout` and `GET /auth/me` handled by `backend/src/modules/auth/interfaces/http/auth.controller.ts`.
- **JWT strategy**: `JwtStrategy` validates tokens and checks Redis session state before allowing access.
- **Session storage**: `AuthSessionService` stores session ids in Redis with TTL defined by `AUTH_SESSION_TTL_SECONDS`; logout and password changes revoke tokens immediately.
- **Guards and decorators**: global `JwtAuthGuard` + `RolesGuard`; `@Roles()`, `@Public()` and `@CurrentUser()` gate endpoints. RBAC uses `UserRole` (Admin / Operator) — brand/model/vehicle mutations require Admin. Rate limiting lives in `backend/src/apps/api/security/security-setup.ts` alongside `SanitizeInputPipe`; helmet hardens HTTP headers.

## Audit trail

- **Interceptor**: `backend/src/modules/audit/interceptors/audit.interceptor.ts` wraps private routes and emits structured events containing request/response metadata and the authenticated actor.
- **Queue publishing**: `AuditService` publishes payloads to RabbitMQ (`audit.event` routing key).
- **Async worker & writer**: `backend/src/apps/audit-worker` consumes audit messages and persists them to the MongoDB `audit_events` collection; a synchronous fallback writes directly to MongoDB when the queue is disabled or unavailable. The schema sits in `backend/src/modules/audit/schemas/audit-event.schema.ts`.

## Messaging

- **Domain events**: Fleet services emit events defined under `backend/src/modules/fleet/domain/events`.
- **Listener**: `FleetDomainEventListener` collects events and forwards them to `MessagingService` if `FEATURE_FLAGS_DOMAIN_EVENTS` is true.
- **Publisher & consumers**: `MessagingService` publishes to the topic exchange `fleetcore.events` (`RABBITMQ_EXCHANGE`); the `vehicle-events` and `audit-events` consumers process deliveries and act as blueprints for downstream integrations.
- **Resilience**: All RabbitMQ calls run through `ResilienceService` (cockatiel retry, circuit breaker, timeout) to avoid cascading failures.

## Observability and controls

- **Metrics**: `DomainMetricsService` tracks counts per event enabling Prometheus/Grafana exporters.
- **Structured logging**: Nest `Logger` captures audit fallbacks, messaging retries and guard denials.
- **Feature toggles**: `FeatureToggleService` reads env flags (e.g. `FEATURE_FLAGS_REPOSITORY_CACHE`, `FEATURE_FLAGS_AUDIT_ASYNC_WORKER`, `FEATURE_FLAGS_DOMAIN_EVENTS`) to enable or disable integrations without code changes.

With this setup the platform can revoke specific sessions, trace every mutating request, replay audit records and integrate with other services through RabbitMQ while remaining resilient to infrastructure hiccups.
