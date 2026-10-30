# Frontend e Experiência

Gestão de frota com marcas, modelos, veículos, usuários, sessão e auditoria. O frontend permite consultar e administrar os registros conforme permissões. SQL Server mantém o domínio relacional; MongoDB mantém auditoria; Redis e RabbitMQ atendem cache, controles operacionais e mensageria.

## Interface e estado

NestJS 11, TypeScript 5.7, TypeORM 0.3, Mongoose 8, Redis, RabbitMQ e Cockatiel no backend; Next.js 16.2.7/React 19.2.4, TanStack Query 5, Redux Toolkit e Zod no frontend. Módulos de domínio separam application, domain, infrastructure e interfaces. Existem entradas distintas para API e audit-worker. A arquitetura usa portas/repositórios, UnitOfWork e eventos de domínio; os adaptadores e feature toggles determinam o comportamento efetivo.

Autenticação, roles, rate limiting, idempotência, locks e cache têm módulos próprios. Ative e configure controles conforme AppConfig/feature toggles, sem pressupor que instalar Redis habilita tudo. Auditoria e logs devem ser consultados por correlationId/requestId quando presentes. Frontend usa contratos OpenAPI e schemas; o backend aplica validação e autorização. Tipos gerados não devem ser editados como fonte principal.

/api/auth/register cria usuário; /api/auth/login valida credenciais e emite JWT com contexto de sessão. /api/auth/me consulta perfil; update/profile e update/password modificam dados; logout invalida sessionId. O JWT não é a única fonte de validade: a sessão também é verificada. Endpoints e decorators de permissão estão na referência do código.

## Fontes verificadas

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

## Arquivos relacionados

- [backend/src/modules/fleet/application/vehicles.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/application/vehicles.service.ts)
- [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts)
- [backend/src/modules/audit/audit.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/audit/audit.service.ts)
- [backend/src/modules/audit/relays/audit-outbox-relay.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/audit/relays/audit-outbox-relay.service.ts)
- [backend/src/shared/features/feature-toggle.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/shared/features/feature-toggle.service.ts)
- [docker-compose.yml](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/docker-compose.yml)

## Navegação

- [Project guide](?menu=pt&lang=pt&id=18)
- [Source reference](?menu=pt&lang=pt&id=19)
