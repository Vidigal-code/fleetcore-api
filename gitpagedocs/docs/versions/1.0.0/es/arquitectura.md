# Arquitectura

Panorama de cómo se conectan backend, dominio y servicios de soporte.

## Backend NestJS

- Módulos `auth`, `fleet`, `users`, `audit` y `messaging`, más la app worker `audit-worker`.
- Guards globales (`JwtAuthGuard`, `RolesGuard`, `RateLimitGuard`) y `AuthSessionService` sobre Redis con TTL deslizante y lock de sesión.
- Protecciones aditivas en Redis: lock distribuido (`RedisLockService`), idempotencia (`IdempotencyService`) y rate limit por usuario/IP/endpoint.
- Eventos de dominio procesados por `FleetDomainEventListener` y enviados a RabbitMQ.

Consulta la sección Arquitectura Backend del menú para el detalle completo.

## Modelado y persistencia

- Entidades TypeORM gestionadas por una migración (`1717845600000-InitSchema.ts`).
- Agregados que preservan invariantes con soporte transaccional del `UnitOfWork`.
- Seeds (`UsersService.ensureAdminSeed`) y dataset de vehículos.

Más información en la sección Modelado de Datos y Dominio.

## Observabilidad

- `AuditInterceptor` que publica eventos enriquecidos (`correlationId`, `requestId`, `sessionId`, `statusCode`…) en RabbitMQ (`fleetcore.audit`); el worker `audit-worker` los persiste en MongoDB con metadatos de procesamiento.
- Métricas de dominio para monitoreo.
- `ResilienceService` (retry/fallback/rollback) y feature toggles controlan reintentos, timeouts y comportamientos opcionales; `UnitOfWork` aporta el rollback transaccional SQL.

Profundiza en la sección Seguridad, Auditoría y Mensajería.
