# Modelado de Datos y Dominio

El sistema se apoya en **TypeORM** con SQL Server. Una única migración (`backend/src/migrations/1717845600000-InitSchema.ts`) provisiona todas las tablas necesarias y las columnas de metadata (`created_at`, `updated_at`, `created_by`).

## Tablas de la base de datos

| Tabla | Columnas clave | Notas |
|-------|----------------|-------|
| `users` | `id`, `nickname`, `name`, `email`, `password_hash`, `roles`, metadata | Seed del admin `aivacol`; roles almacenados como CSV. |
| `brands` | `id`, `name`, metadata | Restricción de unicidad en `name`. |
| `models` | `id`, `name`, `brand_id`, metadata | `brand_id` opcional; FK usa `SET NULL`. |
| `vehicles` | `id`, `license_plate`, `chassis`, `renavam`, `year`, `model_id`, metadata | Unicidad en placa/chasis/renavam; FK elimina en cascada para mantener la integridad referencial. |

## Colección de auditoría (MongoDB)

La traza de auditoría no vive en SQL Server: se persiste en la colección `audit_events` de MongoDB (`backend/src/modules/audit/schemas/audit-event.schema.ts`). El documento lo escribe el worker de auditoría con los campos enriquecidos del evento más metadatos de procesamiento:

| Grupo | Campos |
|-------|--------|
| Identidad del evento | `eventId`, `eventType`, `correlationId`, `requestId` |
| Actor/sesión | `actor`, `userId`, `sessionId` |
| Petición | `method`, `route`, `action`, `statusCode`, `success` |
| Entidad | `entity`, `entityId`, `payload`, `metadata`, `occurredAt` |
| Procesamiento | `status` (`processed`), `retries`, `sourceQueue`, `processedAt` |

Los campos enriquecidos son opcionales (compatibles con documentos previos) y la escritura usa `ResilienceService` (retry/fallback).

## Capa de dominio

- Los agregados (`User`, `Brand`, `Model`, `Vehicle`) encapsulan invariantes y exponen métodos de mutación con transiciones de estado controladas.
- Los eventos de dominio (`VehicleCreatedEvent`, etc.) transportan snapshots para mensajería y auditoría.

## Pipeline de validación

- Los DTO se apoyan en `class-validator` y en esquemas Zod generados desde el backend y consumidos por el frontend (`backend/scripts/export-schemas.ts`).
- Reglas críticas (regex de placa Mercosur, longitud del chasis, estructura RENAVAM) se definen una sola vez en `backend/src/shared/validation/fleet.schema.ts`.

## Repositorios y Unit of Work

- Repositorios personalizados (`VehicleTypeOrmRepository`, `ModelTypeOrmRepository`, ...) traducen agregados a filas persistentes.
- `UnitOfWork` envuelve `EntityManager.transaction()` para que las operaciones complejas (crear/actualizar/eliminar) permanezcan atómicas.

## Seeds y datos de ejemplo

- `UsersService.ensureAdminSeed()` provisiona al administrador durante el bootstrap.
- `backend/seeds/seed_vehicles.json` entrega el dataset de ejemplo solicitado por el desafío.

## Cumplimiento

- Las tablas requeridas (`models`, `vehicles`) más las tablas bonus (`brands`, `users`) están presentes.
- Las reglas de integridad garantizan datos consistentes y reducen duplicidad.
- Los objetos de dominio mantienen las reglas de negocio cerca del núcleo, facilitando pruebas y evoluciones futuras.
