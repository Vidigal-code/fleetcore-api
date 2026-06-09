# Requirements and Criteria

This chapter maps each item from the assignment to the concrete artefact inside the repository, enabling quick compliance checks.

## Functional requirements

| Requirement | Implementation | Notes |
|-------------|----------------|-------|
| CRUD for **models** | `backend/src/modules/fleet/interfaces/http/models.controller.ts` + `models.service.ts` | DTO + Zod validation, optional brand relationship. |
| CRUD for **vehicles** | `vehicles.controller.ts` + `vehicles.service.ts` | Redis cache (`RepositoryCacheService`), automatic invalidation and domain events. |
| CRUD for **brands** (bonus) | `brands.controller.ts` + `brands.service.ts` | Integrated with messaging/audit, linked to models/vehicles. |
| Vehicle ↔ model ↔ brand relationship | Aggregates under `backend/src/modules/fleet/domain` | Services enforce existence of model/brand before persisting vehicles. |
| Seed user `aivacol` | `backend/src/apps/api/app-bootstrap.service.ts` + `UsersService.ensureAdminSeed()` | Default admin role, strong password configurable via env. |

## Technical requirements

- **Clean architecture / DDD**: isolated modules (`auth`, `fleet`, `audit`, `messaging`, `users`, `shared`), aggregates, repositories and `UnitOfWork`.
- **Robust security**: JWT guard + `RolesGuard`, Redis sessions (`AuthSessionService`), audit interceptor, sanitization pipe.
- **Standardized modelling**: TypeORM migrations (`backend/src/migrations/1717845600000-InitSchema.ts`) with SQL Server columns and metadata.
- **Redis cache**: `RepositoryCacheService` storing vehicle search results (`vehicles.search` namespace) with configurable TTL (`REDIS_TTL_SECONDS`).
- **RabbitMQ messaging** (bonus): dedicated module + `FleetDomainEventListener` forwarding domain events.
- **MongoDB audit trail** (bonus): `AuditService` produces messages, `AuditWriterService` persists fallback documents via Mongoose.
- **Full Docker stack**: `docker-compose.yml` bootstraps SQL Server, Redis, RabbitMQ, MongoDB, API and frontend.

## Evaluation criteria met

- **Code clarity & organization**: consistent naming, modules, documentation (README + gitpagedocs).
- **Efficiency & low redundancy**: constants for events (`fleet.constants.ts`), shared Zod schemas between backend and frontend.
- **Proper TypeORM usage**: dedicated entities, repositories and a single migration.
- **REST best practices**: controllers with verbs, HTTP exceptions, OpenAPI decorators, DTO responses.
- **Testing**: unit/integration/e2e suites (`backend/tests`) and Playwright/RTL for the frontend (`frontend/tests`).
- **Error handling**: resilience layer for RabbitMQ, audit fallback, structured logging.

## Additional evidence

- **Swagger documentation** in PT/EN (`/docs-pt`, `/docs`).
- **Unified `.env`** file to configure backend and frontend.
- **This GitPageDocs** instance summarising architecture and implementation details for reviewers.
