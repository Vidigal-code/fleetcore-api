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
- **Seguridad robusta**: guard de JWT + `RolesGuard`, sesiones Redis (`AuthSessionService`), interceptor de auditoría, pipe de sanitización.
- **Modelado estandarizado**: migraciones TypeORM (`backend/src/migrations/1717845600000-InitSchema.ts`) con columnas y metadatos de SQL Server.
- **Caché Redis**: `RepositoryCacheService` almacenando resultados de búsqueda de vehículos (namespace `vehicles.search`) con TTL configurable (`REDIS_TTL_SECONDS`).
- **Mensajería RabbitMQ** (bonus): módulo dedicado + `FleetDomainEventListener` retransmitiendo eventos de dominio.
- **Traza de auditoría en MongoDB** (bonus): `AuditService` produce mensajes, `AuditWriterService` persiste documentos de respaldo vía Mongoose.
- **Stack Docker completo**: `docker-compose.yml` levanta SQL Server, Redis, RabbitMQ, MongoDB, API y frontend.

## Criterios de evaluación cumplidos

- **Claridad y organización del código**: nombres consistentes, módulos y documentación (README + gitpagedocs).
- **Eficiencia y baja redundancia**: constantes para eventos (`fleet.constants.ts`), esquemas Zod compartidos entre backend y frontend.
- **Uso adecuado de TypeORM**: entidades dedicadas, repositorios y una única migración.
- **Buenas prácticas REST**: controllers con verbos, excepciones HTTP, decoradores OpenAPI, DTOs de respuesta.
- **Pruebas**: suites unitarias/integración/e2e (`backend/tests`) y Playwright/RTL para el frontend (`frontend/tests`).
- **Manejo de errores**: capa de resiliencia para RabbitMQ, respaldo de auditoría, logging estructurado.

## Evidencias adicionales

- **Documentación Swagger** en PT/EN (`/docs-pt`, `/docs`).
- **Archivo `.env` unificado** para configurar backend y frontend.
- **Esta instancia de GitPageDocs** resumiendo arquitectura y detalles de implementación para los revisores.
