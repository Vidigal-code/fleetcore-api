# Arquitectura

Panorama de cómo se conectan backend, dominio y servicios de soporte.

## Backend NestJS

- Módulos `auth`, `fleet`, `users`, `audit` y `messaging`.
- Guards globales (`JwtAuthGuard`, `RolesGuard`) y `AuthSessionService` sobre Redis.
- Eventos de dominio procesados por `FleetDomainEventListener` y enviados a RabbitMQ.

Consulta la sección Arquitectura Backend del menú para el detalle completo.

## Modelado y persistencia

- Entidades TypeORM gestionadas por una migración (`1717845600000-InitSchema.ts`).
- Agregados que preservan invariantes con soporte transaccional del `UnitOfWork`.
- Seeds (`UsersService.ensureAdminSeed`) y dataset de vehículos.

Más información en la sección Modelado de Datos y Dominio.

## Observabilidad

- Interceptor de auditoría que graba en MongoDB y publica en RabbitMQ.
- Métricas de dominio para monitoreo.
- `ResilienceService` y feature toggles controlan reintentos, timeouts y comportamientos opcionales.

Profundiza en la sección Seguridad, Auditoría y Mensajería.
