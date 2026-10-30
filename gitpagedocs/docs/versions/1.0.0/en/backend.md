# Back-end

Fleet management for brands, models, vehicles, users, sessions and audit. The frontend browses/manages records according to permissions. SQL Server stores relational domain data, MongoDB stores audit, while Redis/RabbitMQ provide caching, operational controls and messaging.

## Workflow and failure cases

1. /api/auth/register creates users; /api/auth/login validates credentials and issues a JWT with session context. /api/auth/me reads the profile; update/profile and update/password mutate it; logout invalidates sessionId. JWT signature is not the only validity check: the session is also verified. The source reference links endpoints and permission decorators.

2. Brand → associated model → vehicle. VehiclesService checks model existence and uniqueness before persistence and uppercases plates. The aggregate stores plate, chassis, renavam, year, modelId, actor and dates. Search filters plate/model/brand with pagination (page 1, limit 20 defaults). Detailed format rules reside in DTOs/value objects, not only the entity.

3. Reads use RepositoryCacheService when repositoryCache is enabled; writes use UnitOfWork and invalidate list/detail caches. They then record audit and publish domain events. SQL commit and external-system delivery are separate steps, not one transaction spanning SQL, Mongo and the broker.

4. AuditService publishes to the broker with auditAsyncWorker enabled. Publication failure queues a Mongo outbox entry; failure there falls back to direct persistence. With the toggle off it persists directly. The relay runs only in audit-worker, recovers abandoned PROCESSING entries and republishes batches with an attempt limit. Monitor terminal states/logs; fallback cannot eliminate failure of every dependency.

| Method and path | Declaration |
| --- | --- |
| `DELETE /api/brands/:id` | [backend/src/modules/fleet/interfaces/http/brands.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/brands.controller.ts) |
| `DELETE /api/models/:id` | [backend/src/modules/fleet/interfaces/http/models.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/models.controller.ts) |
| `DELETE /api/vehicles/:id` | [backend/src/modules/fleet/interfaces/http/vehicles.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/vehicles.controller.ts) |
| `GET /api/auth/me` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `GET /api/brands/:id` | [backend/src/modules/fleet/interfaces/http/brands.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/brands.controller.ts) |
| `GET /api/brands` | [backend/src/modules/fleet/interfaces/http/brands.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/brands.controller.ts) |
| `GET /api/models/:id` | [backend/src/modules/fleet/interfaces/http/models.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/models.controller.ts) |
| `GET /api/models` | [backend/src/modules/fleet/interfaces/http/models.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/models.controller.ts) |
| `GET /api/vehicles/:id` | [backend/src/modules/fleet/interfaces/http/vehicles.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/vehicles.controller.ts) |
| `GET /api/vehicles` | [backend/src/modules/fleet/interfaces/http/vehicles.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/vehicles.controller.ts) |
| `PATCH /api/brands/:id` | [backend/src/modules/fleet/interfaces/http/brands.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/brands.controller.ts) |
| `PATCH /api/models/:id` | [backend/src/modules/fleet/interfaces/http/models.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/models.controller.ts) |
| `PATCH /api/vehicles/:id` | [backend/src/modules/fleet/interfaces/http/vehicles.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/vehicles.controller.ts) |
| `POST /api/auth/login` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `POST /api/auth/logout` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `POST /api/auth/register` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `POST /api/auth/update/password` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `POST /api/auth/update/profile` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `POST /api/brands` | [backend/src/modules/fleet/interfaces/http/brands.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/brands.controller.ts) |
| `POST /api/models` | [backend/src/modules/fleet/interfaces/http/models.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/models.controller.ts) |
| `POST /api/vehicles` | [backend/src/modules/fleet/interfaces/http/vehicles.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/vehicles.controller.ts) |

## Request example

```http
POST /api/vehicles HTTP/1.1
Authorization: Bearer <access-token>
Content-Type: application/json

{"licensePlate":"ABC1D23","chassis":"9BWZZZ377VT004251","renavam":"12345678901","year":2024,"modelId":"00000000-0000-4000-8000-000000000001"}
```

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
