# Quality & Operations

Condensed view of the automation and operational routines that keep the solution healthy.

## Quality

- `npm run lint`, `npm test`, `npm run test:e2e` gate backend and frontend changes.
- Jest covers services, guards and integration flows.
- Playwright validates mission-critical UI scenarios.

## Operations

- Docker Compose spins up SQL Server, Redis, RabbitMQ, MongoDB, API and frontend.
- `npm run generate:openapi` and `npm run export:schemas` keep documentation and validation aligned.
- Feature toggles allow enabling/disabling cache, audit worker and domain events per environment.

## References

- [Quality and Testing](./08-quality-testing.md)
- [Runbook and Troubleshooting](./09-runbook.md)
