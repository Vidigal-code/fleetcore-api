# Preguntas

Gestión de flota con marcas, modelos, vehículos, usuarios, sesión y auditoría. El frontend consulta/administra según permisos. SQL Server conserva dominio relacional, MongoDB auditoría y Redis/RabbitMQ caché, controles operativos y mensajería.

## Flujo y casos de fallo

1. /api/auth/register crea usuarios; /api/auth/login valida credenciales y emite JWT con sesión. /api/auth/me consulta perfil; update/profile y update/password modifican; logout invalida sessionId. La firma JWT no es la única comprobación: también se verifica sesión. La referencia enlaza rutas y permisos.

2. Marca → modelo asociado → vehículo. VehiclesService verifica modelo y unicidad, normalizando matrícula a mayúsculas. El agregado guarda matrícula, chasis, renavam, año, modelId, autor y fechas. Busca filtra matrícula/modelo/marca y pagina (1, límite 20 por defecto). DTOs/value objects contienen validaciones de formato.

3. Lecturas usan RepositoryCacheService con repositoryCache activo; escrituras usan UnitOfWork e invalidan cachés de lista/detalle. Después auditan y publican eventos. Commit SQL y entrega externa son etapas distintas, no una transacción conjunta SQL/Mongo/broker.

4. AuditService publica al broker con auditAsyncWorker activo. Si falla usa outbox Mongo; si también falla intenta escritura directa. Con toggle desactivado escribe directamente. El relay solo ejecuta en audit-worker, recupera PROCESSING abandonadas y republica lotes con límite de intentos. Vigile estados terminales/logs; fallback no evita la caída de todas las dependencias.

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
