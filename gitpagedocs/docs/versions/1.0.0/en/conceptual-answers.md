# Conceptual Answers

Frequently asked questions captured during reviews and interviews.

## Why a DDD + modular structure?

It keeps bounded contexts independent, simplifies testing and allows scaling specific capabilities (fleet, auth, audit, messaging) without cross-impact. See [Backend Architecture](./03-backend-architecture.md).

## How are sessions revoked without killing all tokens?

`AuthSessionService` stores session identifiers in Redis with TTL and deletes them on logout, so guards reject stale tokens. Details in [Security, Audit and Messaging](./05-security-audit-messaging.md).

## How do frontend and backend share validation rules?

Zod schemas are generated in the backend (`npm run export:schemas`) and imported into the FSD layers for consistent messaging. Learn more in [Frontend and Experience](./06-frontend.md).

## What powers observability?

Structured logging, MongoDB audit trail, RabbitMQ events and domain metrics enable troubleshooting and monitoring hooks. Revisit [Quality and Testing](./08-quality-testing.md).
