# Requisitos y Criterios

Este capítulo mapea cada ítem del desafío con el artefacto concreto dentro del repositorio, lo que permite verificar rápidamente el cumplimiento.

## Requisitos funcionales

| Requisito | Implementación | Notas |
|-----------|----------------|-------|
| CRUD de **modelos** | `backend/src/modules/fleet/interfaces/http/models.controller.ts` + `models.service.ts` | DTO con validación Zod, relación opcional con marca. |
| CRUD de **vehículos** | `vehicles.controller.ts` + `vehicles.service.ts` | Caché Redis (`RepositoryCacheService`), invalidación automática y eventos de dominio. |
| CRUD de **marcas** (bonus) | `brands.controller.ts` + `brands.service.ts` | Integrado con mensajería/auditoría, enlazado a modelos/vehículos. |
| Relación vehículo ↔ modelo ↔ marca | Agregados en `backend/src/modules/fleet/domain` | Los servicios garantizan la existencia de modelo/marca antes de persistir vehículos. |
| Seed del usuario `aivacol` | `backend/src/apps/api/app-bootstrap.service.ts` + `UsersService.ensureAdminSeed()` | Rol admin por defecto, contraseña robusta configurable por ambiente. |

## Requisitos técnicos

- **Arquitectura limpia / DDD**: módulos aislados (`auth`, `fleet`, `audit`, `messaging`, `users`, `shared`), agregados, repositorios y `UnitOfWork`.
- **Seguridad robusta**: guard de JWT + `RolesGuard`, sesiones Redis con TTL deslizante y lock (`AuthSessionService`: `refresh`/`lock`/`unlock`/`isLocked`), interceptor de auditoría, pipe de sanitización y rate limit dedicado en Redis (`RateLimitGuard`).
- **Protección de la base con Redis**: caché de lectura, idempotencia (`IdempotencyService` + `IdempotencyInterceptor`, header `Idempotency-Key`, 409 ante duplicados), lock distribuido (`RedisLockService`) y rate limit por usuario/IP/endpoint.
- **Modelado estandarizado**: migraciones TypeORM (`backend/src/migrations/1717845600000-InitSchema.ts`) con columnas y metadatos de SQL Server.
- **Caché Redis**: `RepositoryCacheService` almacenando resultados de búsqueda de vehículos (namespace `vehicles.search`) con TTL configurable (`REDIS_TTL_SECONDS`).
- **Mensajería RabbitMQ** (bonus): módulo dedicado + `FleetDomainEventListener` retransmitiendo eventos de dominio.
- **Traza de auditoría en MongoDB** (bonus): el `AuditInterceptor` publica eventos enriquecidos (`eventId`, `correlationId`, `requestId`, `sessionId`, `statusCode`…) en la cola `fleetcore.audit` cuando el toggle `auditAsyncWorker` está activo (si está apagado, escribe síncrono en Mongo); la app `audit-worker` los persiste vía Mongoose con metadatos de procesamiento (`status`, `retries`, `processedAt`). Si RabbitMQ cae, el evento se guarda en `audit_outbox` y se republica al recuperarse el broker.
- **Resiliencia**: `ResilienceService` con `executeWithRetry`/`executeWithFallback`/`executeWithRollback`; `UnitOfWork` para el rollback transaccional SQL.
- **Stack Docker completo**: `docker-compose.yml` levanta SQL Server, Redis, RabbitMQ, MongoDB, API, frontend y el worker `audit-worker`.

## Criterios de evaluación cumplidos

- **Claridad y organización del código**: nombres consistentes, módulos y documentación (README + gitpagedocs).
- **Eficiencia y baja redundancia**: constantes para eventos (`fleet.constants.ts`), esquemas Zod compartidos entre backend y frontend.
- **Uso adecuado de TypeORM**: entidades dedicadas, repositorios y una única migración.
- **Buenas prácticas REST**: controllers con verbos, excepciones HTTP, decoradores OpenAPI, DTOs de respuesta.
- **Pruebas**: suites unitarias/integración/e2e (`backend/tests`) y Playwright/RTL para el frontend (`frontend/tests`).
- **Manejo de errores**: capa de resiliencia para RabbitMQ, respaldo de auditoría, logging estructurado.

## Evidencias adicionales

- **Documentación Swagger** en PT/EN (`/docs-pt`, `/docs`) con tema oscuro de la identidad Fleetcore, "Try it out" habilitado, ejemplos bilingües (PT/EN) en cada DTO y el cuerpo de `POST /auth/login` precargado con las credenciales seed (`aivacol` / `aivacol123!`).
- **Archivo `.env` unificado** (`envexample.txt` copiado a `.env` en la raíz) para configurar backend y frontend. Incorpora las variables aditivas (nombres existentes preservados, sin renombrar): `REDIS_LOCK_TTL=30`, `WORKER_CONCURRENCY=2`, `RABBITMQ_RETRY_QUEUE=fleetcore.retry`, `RABBITMQ_DLQ=fleetcore.dead-letter`, `RATE_LIMIT_ENABLED=true`, `RATE_LIMIT_WINDOW_SECONDS=60`, `RATE_LIMIT_MAX_REQUESTS=100`, `RATE_LIMIT_AUTH_MAX_REQUESTS=10`, `RATE_LIMIT_AUTH_WINDOW_SECONDS=60`, `RETRY_MAX_ATTEMPTS=5` y `RETRY_INITIAL_DELAY=1000`.
- **Esta instancia de GitPageDocs** resumiendo arquitectura y detalles de implementación para los revisores.
