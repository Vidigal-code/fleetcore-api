# Frontend and Experience

Fleet management for brands, models, vehicles, users, sessions and audit. The frontend browses/manages records according to permissions. SQL Server stores relational domain data, MongoDB stores audit, while Redis/RabbitMQ provide caching, operational controls and messaging.

## UI and state

NestJS 11, TypeScript 5.7, TypeORM 0.3, Mongoose 8, Redis, RabbitMQ and Cockatiel backend; Next.js 16.2.7/React 19.2.4, TanStack Query 5, Redux Toolkit and Zod frontend. Domain modules separate application, domain, infrastructure and interfaces. API and audit-worker have separate entry points. Ports/repositories, UnitOfWork and domain events structure the application; adapters/feature toggles determine actual behavior.

Authentication, roles, rate limiting, idempotency, locks and cache have dedicated modules. Configure controls through AppConfig/feature toggles; Redis installation alone does not enable everything. Correlate audit/logs by correlationId/requestId when present. The frontend uses OpenAPI contracts/schemas; the backend enforces validation/authorization. Generated types are not the primary source to edit.

/api/auth/register creates users; /api/auth/login validates credentials and issues a JWT with session context. /api/auth/me reads the profile; update/profile and update/password mutate it; logout invalidates sessionId. JWT signature is not the only validity check: the session is also verified. The source reference links endpoints and permission decorators.

## Verified sources

- [frontend/src/app/(auth)/login/page.tsx](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/app/(auth)/login/page.tsx)
- [frontend/src/app/(auth)/recover/page.tsx](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/app/(auth)/recover/page.tsx)
- [frontend/src/app/(auth)/register/page.tsx](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/app/(auth)/register/page.tsx)
- [frontend/src/app/(protected)/brands/page.tsx](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/app/(protected)/brands/page.tsx)
- [frontend/src/app/(protected)/dashboard/page.tsx](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/app/(protected)/dashboard/page.tsx)
- [frontend/src/app/(protected)/models/page.tsx](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/app/(protected)/models/page.tsx)
- [frontend/src/app/(protected)/profile/page.tsx](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/app/(protected)/profile/page.tsx)
- [frontend/src/app/(protected)/vehicles/page.tsx](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/app/(protected)/vehicles/page.tsx)
- [frontend/src/app/page.tsx](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/app/page.tsx)
- [frontend/src/entities/brand/api/brand-api.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/entities/brand/api/brand-api.ts)
- [frontend/src/entities/model/api/model-api.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/entities/model/api/model-api.ts)
- [frontend/src/entities/vehicle/api/vehicle-api.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/entities/vehicle/api/vehicle-api.ts)
- [frontend/src/processes/app/store/hooks.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/processes/app/store/hooks.ts)
- [frontend/src/processes/app/store/store.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/processes/app/store/store.ts)
- [frontend/src/processes/auth/model/auth-slice.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/processes/auth/model/auth-slice.ts)
- [frontend/src/shared/api/auth-client.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/shared/api/auth-client.ts)
- [frontend/src/shared/api/fleet-client.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/shared/api/fleet-client.ts)
- [frontend/src/shared/api/http-client.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/shared/api/http-client.ts)
- [frontend/src/shared/api/http-error.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/shared/api/http-error.ts)
- [frontend/src/shared/constants/routes.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/frontend/src/shared/constants/routes.ts)

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
