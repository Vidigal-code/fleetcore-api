# Conceptual Answers

Frequently asked questions captured during reviews and interviews.

## Why a DDD + modular structure?

It keeps bounded contexts independent, simplifies testing and allows scaling specific capabilities (fleet, auth, audit, messaging) without cross-impact. Refer to the Backend Architecture section for full context.

## How are sessions revoked without killing all tokens?

`AuthSessionService` stores session identifiers in Redis with TTL and deletes them on logout, so guards reject stale tokens. The TTL is **sliding** — `JwtStrategy` calls `refresh()` on every valid request — and sessions can be individually **locked** (`lock`/`unlock`/`isLocked`), which makes `JwtStrategy` reject them with `401` without affecting other users. The active session lives only in Redis; MongoDB keeps audit history. Details appear in the Security, Audit and Messaging section.

## How do you protect critical operations and the database?

Through Redis-backed layers: read cache (`RepositoryCacheService`), idempotency (`IdempotencyService` + `IdempotencyInterceptor` reading the `Idempotency-Key` header, `409` on duplicates), a distributed lock (`RedisLockService`, owner-token validated to avoid foreign unlocks and deadlocks) and a dedicated rate-limit guard (`100/60s` default, `10/60s` on login, `429` with `retryAfter`). At the application level, `ResilienceService` adds retry, fallback and rollback, while `UnitOfWork` handles DB transactions.

## How do frontend and backend share validation rules?

Zod schemas are generated in the backend (`npm run export:schemas`) and imported into the FSD layers for consistent messaging. Learn more in the Frontend and Experience section.

## What powers observability?

Structured logging, MongoDB audit trail, RabbitMQ events and domain metrics enable troubleshooting and monitoring hooks. Revisit the Quality and Testing section.
