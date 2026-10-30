# Security, Audit and Messaging

Fleet management for brands, models, vehicles, users, sessions and audit. The frontend browses/manages records according to permissions. SQL Server stores relational domain data, MongoDB stores audit, while Redis/RabbitMQ provide caching, operational controls and messaging.

## Data contracts

Authentication, roles, rate limiting, idempotency, locks and cache have dedicated modules. Configure controls through AppConfig/feature toggles; Redis installation alone does not enable everything. Correlate audit/logs by correlationId/requestId when present. The frontend uses OpenAPI contracts/schemas; the backend enforces validation/authorization. Generated types are not the primary source to edit.

## Workflow and failure cases

/api/auth/register creates users; /api/auth/login validates credentials and issues a JWT with session context. /api/auth/me reads the profile; update/profile and update/password mutate it; logout invalidates sessionId. JWT signature is not the only validity check: the session is also verified. The source reference links endpoints and permission decorators.

Copy envexample.txt to .env; Compose starts SQL Server/bootstrap, Redis, Mongo, RabbitMQ, API, audit-worker and frontend. Both backend processes are needed for async audit. Use generate:openapi/export:schemas/generate:client with a running API; generate:client references localhost:3000/docs-json. Run backend test/test:e2e/build and frontend test/test:e2e/lint/build with harness dependencies. For stale lists check invalidation/toggle; missing audit, worker/broker/outbox/Mongo; post-login 401, session/Redis/secret. Terraform under infra describes infrastructure; documentation updates do not apply cloud resources.

## Related files

- [backend/src/modules/fleet/application/vehicles.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/application/vehicles.service.ts)
- [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts)
- [backend/src/modules/audit/audit.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/audit/audit.service.ts)
- [backend/src/modules/audit/relays/audit-outbox-relay.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/audit/relays/audit-outbox-relay.service.ts)
- [backend/src/shared/features/feature-toggle.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/shared/features/feature-toggle.service.ts)
- [docker-compose.yml](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/docker-compose.yml)

## Navigation

- [Project guide](?menu=en&lang=en&id=18)
- [Source reference](?menu=en&lang=en&id=19)
