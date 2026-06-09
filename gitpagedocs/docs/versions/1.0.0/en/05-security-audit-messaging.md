# Security, Audit and Messaging

Security and observability were treated as first-class concerns. Authentication, audit logging and messaging work together to deliver traceability and reliability.

## Authentication & authorization

- **JWT + RBAC**: `AuthController` exposes `POST /auth/login`, `POST /auth/register`, `POST /auth/logout` and `GET /auth/me`. Tokens are validated by `JwtAuthGuard`, while `RolesGuard` enforces role-based access.
- **Redis-backed sessions**: `AuthSessionService` issues a UUID `sessionId`, stores it with a TTL (`AUTH_SESSION_TTL_SECONDS`) and revokes it on logout. `JwtStrategy` checks Redis before accepting a token.
- **Sanitization & rate limiting**: `SanitizeInputPipe` removes control characters and `ThrottlerGuard` applies per-route quotas (`SECURITY_RATE_LIMIT_*`).

## MongoDB audit trail

- `AuditInterceptor` captures every private request/response pair and assigns a `correlationId`.
- `AuditService` publishes payloads to the `audit.event` queue; on failure it falls back to `AuditWriterService`, persisting directly in MongoDB.
- Schemas live in `backend/src/modules/audit/schemas`, keeping the audit log queryable.

## RabbitMQ messaging

- `FleetDomainEventListener` listens to domain events and forwards them to the topic exchange `fleetcore.events` with keys such as `vehicle.created`.
- `MessagingService` wraps `AmqpConnection` with retry and circuit breaker policies (powered by `ResilienceService`).
- `VehicleEventsConsumer` demonstrates consumption and logging of those events, serving as a blueprint for downstream services.

## Logging & metrics

- NestJS `Logger` records retries, circuit breaker trips and audit fallbacks.
- `DomainMetricsService` increments counters per event, paving the road for Prometheus/Grafana integration.

## Configurability

- Environment variables control secrets (`JWT_SECRET`), TTLs, RabbitMQ/Mongo endpoints and feature flags.
- `FeatureToggleService` lets you disable cache, domain events or the async audit worker without code changes (useful for debugging or constrained environments).

## Why it matters

- Authentication can be revoked per session without invalidating all tokens.
- Every action is auditable across HTTP, RabbitMQ and MongoDB.
- Messaging ensures decoupled integrations (notifications, analytics, etc.) while resilience mechanisms guard against infrastructure hiccups.
