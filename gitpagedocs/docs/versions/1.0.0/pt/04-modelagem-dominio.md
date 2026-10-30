# Modelagem de Dados e Domínio

Gestão de frota com marcas, modelos, veículos, usuários, sessão e auditoria. O frontend permite consultar e administrar os registros conforme permissões. SQL Server mantém o domínio relacional; MongoDB mantém auditoria; Redis e RabbitMQ atendem cache, controles operacionais e mensageria.

## Contratos de dados

Autenticação, roles, rate limiting, idempotência, locks e cache têm módulos próprios. Ative e configure controles conforme AppConfig/feature toggles, sem pressupor que instalar Redis habilita tudo. Auditoria e logs devem ser consultados por correlationId/requestId quando presentes. Frontend usa contratos OpenAPI e schemas; o backend aplica validação e autorização. Tipos gerados não devem ser editados como fonte principal.

### brand.orm-entity

[backend/src/modules/fleet/infrastructure/entities/brand.orm-entity.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/infrastructure/entities/brand.orm-entity.ts)

| Field | Type |
| --- | --- |
| `name` | `string` |
| `models` | `ModelOrmEntity[]` |

### model.orm-entity

[backend/src/modules/fleet/infrastructure/entities/model.orm-entity.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/infrastructure/entities/model.orm-entity.ts)

| Field | Type |
| --- | --- |
| `name` | `string` |
| `brand` | `BrandOrmEntity \| null` |
| `brandId` | `string \| null` |
| `vehicles` | `VehicleOrmEntity[]` |

### vehicle.orm-entity

[backend/src/modules/fleet/infrastructure/entities/vehicle.orm-entity.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/infrastructure/entities/vehicle.orm-entity.ts)

| Field | Type |
| --- | --- |
| `licensePlate` | `string` |
| `chassis` | `string` |
| `renavam` | `string` |
| `year` | `number` |
| `model` | `ModelOrmEntity` |
| `modelId` | `string` |

### user.orm-entity

[backend/src/modules/users/infrastructure/entities/user.orm-entity.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/users/infrastructure/entities/user.orm-entity.ts)

| Field | Type |
| --- | --- |
| `nickname` | `string` |
| `name` | `string` |
| `email` | `string` |
| `passwordHash` | `string` |
| `roles` | `UserRole[]` |

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
