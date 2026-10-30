# Data and Domain Modeling

Fleet management for brands, models, vehicles, users, sessions and audit. The frontend browses/manages records according to permissions. SQL Server stores relational domain data, MongoDB stores audit, while Redis/RabbitMQ provide caching, operational controls and messaging.

## Data contracts

Authentication, roles, rate limiting, idempotency, locks and cache have dedicated modules. Configure controls through AppConfig/feature toggles; Redis installation alone does not enable everything. Correlate audit/logs by correlationId/requestId when present. The frontend uses OpenAPI contracts/schemas; the backend enforces validation/authorization. Generated types are not the primary source to edit.

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
