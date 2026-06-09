# Conceptual Answers

Frequently asked questions captured during reviews and interviews.

## Why a DDD + modular structure?

It keeps bounded contexts independent, simplifies testing and allows scaling specific capabilities (fleet, auth, audit, messaging) without cross-impact. Refer to the Backend Architecture section for full context.

## How are sessions revoked without killing all tokens?

`AuthSessionService` stores session identifiers in Redis with TTL and deletes them on logout, so guards reject stale tokens. Details appear in the Security, Audit and Messaging section.

## How do frontend and backend share validation rules?

Zod schemas are generated in the backend (`npm run export:schemas`) and imported into the FSD layers for consistent messaging. Learn more in the Frontend and Experience section.

## What powers observability?

Structured logging, MongoDB audit trail, RabbitMQ events and domain metrics enable troubleshooting and monitoring hooks. Revisit the Quality and Testing section.
