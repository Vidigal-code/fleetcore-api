# Arquitectura

Panorama de cómo se conectan backend, dominio y servicios de soporte.

## Backend NestJS

- Módulos `auth`, `fleet`, `users`, `audit` y `messaging`.
- Guards globales (`JwtAuthGuard`, `RolesGuard`) y `AuthSessionService` sobre Redis.
- Eventos de dominio procesados por `FleetDomainEventListener` y enviados a RabbitMQ.

Consulta [Arquitectura Backend](./03-arquitectura-backend.md) para el detalle completo.

## Modelado y persistencia

- Entidades TypeORM gestionadas por una migración (`1717845600000-InitSchema.ts`).
- Agregados que preservan invariantes con soporte transaccional del `UnitOfWork`.
- Seeds (`UsersService.ensureAdminSeed`) y dataset de vehículos.

Más información en [Modelado de Datos y Dominio](./04-modelado-dominio.md).

## Observabilidad

- Interceptor de auditoría que graba en MongoDB y publica en RabbitMQ.
- Métricas de dominio para monitoreo.
- `ResilienceService` y feature toggles controlan reintentos, timeouts y comportamientos opcionales.

Profundiza en [Seguridad, Auditoría y Mensajería](./05-seguridad-auditoria-mensajeria.md).
