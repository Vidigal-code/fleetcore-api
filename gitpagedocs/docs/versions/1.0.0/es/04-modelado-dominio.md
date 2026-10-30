# Modelado de Datos y Dominio

Gestión de flota con marcas, modelos, vehículos, usuarios, sesión y auditoría. El frontend consulta/administra según permisos. SQL Server conserva dominio relacional, MongoDB auditoría y Redis/RabbitMQ caché, controles operativos y mensajería.

## Contratos de datos

Autenticación, roles, rate limiting, idempotencia, locks y caché tienen módulos propios. Configure controles mediante AppConfig/toggles; instalar Redis no activa todo. Correlacione logs/auditoría por correlationId/requestId cuando existan. Frontend usa OpenAPI/schemas; backend valida y autoriza. Los tipos generados no son fuente principal editable.

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
