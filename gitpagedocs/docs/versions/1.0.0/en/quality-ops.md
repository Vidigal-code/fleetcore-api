# Quality & Operations

Condensed view of the automation and operational routines that keep the solution healthy.

## Quality

- `npm run lint`, `npm test`, `npm run test:e2e` gate backend and frontend changes.
- Jest covers backend services, guards and integration flows (incl. vehicle search/ordering), plus new specs for sessions (`auth-session.service`), distributed lock, idempotency, rate limit and resilience fallback/rollback, and frontend units (auth slice, ConfirmDialog, SelectField).
- Playwright validates the login flow.

## Operations

- Docker Compose spins up SQL Server, Redis, RabbitMQ, MongoDB, API and frontend.
- `npm run generate:openapi` and `npm run export:schemas` keep documentation and validation aligned.
- A dedicated `audit-worker` compose service consumes `fleetcore.audit` and writes to MongoDB; its concurrency is set by `WORKER_CONCURRENCY`.
- Feature toggles allow enabling/disabling cache, audit worker and domain events per environment; rate limiting, locking and resilience are tuned via `RATE_LIMIT_*`, `REDIS_LOCK_TTL` and `RETRY_*` variables.

## References

- **Quality and Testing**
- **Runbook and Troubleshooting**
