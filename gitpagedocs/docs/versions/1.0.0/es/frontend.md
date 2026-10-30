# Front-end

Gestión de flota con marcas, modelos, vehículos, usuarios, sesión y auditoría. El frontend consulta/administra según permisos. SQL Server conserva dominio relacional, MongoDB auditoría y Redis/RabbitMQ caché, controles operativos y mensajería.

## Interfaz y estado

Backend NestJS 11, TypeScript 5.7, TypeORM 0.3, Mongoose 8, Redis, RabbitMQ y Cockatiel; frontend Next.js 16.2.7/React 19.2.4, TanStack Query 5, Redux Toolkit y Zod. Módulos separan application, domain, infrastructure e interfaces. API y audit-worker tienen entradas distintas. Puertos/repositorios, UnitOfWork y eventos estructuran la aplicación; adaptadores/toggles determinan comportamiento.

Autenticación, roles, rate limiting, idempotencia, locks y caché tienen módulos propios. Configure controles mediante AppConfig/toggles; instalar Redis no activa todo. Correlacione logs/auditoría por correlationId/requestId cuando existan. Frontend usa OpenAPI/schemas; backend valida y autoriza. Los tipos generados no son fuente principal editable.

/api/auth/register crea usuarios; /api/auth/login valida credenciales y emite JWT con sesión. /api/auth/me consulta perfil; update/profile y update/password modifican; logout invalida sessionId. La firma JWT no es la única comprobación: también se verifica sesión. La referencia enlaza rutas y permisos.

## Fuentes verificadas

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

## Archivos relacionados

- [backend/src/modules/fleet/application/vehicles.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/application/vehicles.service.ts)
- [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts)
- [backend/src/modules/audit/audit.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/audit/audit.service.ts)
- [backend/src/modules/audit/relays/audit-outbox-relay.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/audit/relays/audit-outbox-relay.service.ts)
- [backend/src/shared/features/feature-toggle.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/shared/features/feature-toggle.service.ts)
- [docker-compose.yml](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/docker-compose.yml)

## Navegación

- [Project guide](?menu=es&lang=es&id=18)
- [Source reference](?menu=es&lang=es&id=19)
