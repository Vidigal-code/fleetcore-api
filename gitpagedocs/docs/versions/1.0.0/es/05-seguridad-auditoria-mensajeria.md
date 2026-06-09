# Seguridad, Auditoría y Mensajería

La seguridad y la observabilidad se trataron como preocupaciones de primera clase. Autenticación, auditoría y mensajería trabajan juntas para ofrecer trazabilidad y confiabilidad.

## Autenticación y autorización

- **JWT + RBAC**: `AuthController` expone `POST /auth/login`, `POST /auth/register`, `POST /auth/logout` y `GET /auth/me`. `JwtAuthGuard` valida tokens, mientras que `RolesGuard` aplica el control de acceso basado en roles.
- **Sesiones respaldadas en Redis**: `AuthSessionService` emite un `sessionId` UUID, lo almacena con un TTL (`AUTH_SESSION_TTL_SECONDS`) y lo revoca en el logout. `JwtStrategy` verifica Redis antes de aceptar un token.
- **Sanitización y rate limiting**: `SanitizeInputPipe` elimina caracteres de control y `ThrottlerGuard` aplica cuotas por ruta (`SECURITY_RATE_LIMIT_*`).

## Traza de auditoría en MongoDB

- `AuditInterceptor` captura cada par petición/respuesta privada y asigna un `correlationId`.
- `AuditService` publica payloads en la cola `audit.event`; si falla, recurre a `AuditWriterService`, persistiendo directamente en MongoDB.
- Los esquemas viven en `backend/src/modules/audit/schemas`, manteniendo el log de auditoría consultable.

## Mensajería RabbitMQ

- `FleetDomainEventListener` escucha eventos de dominio y los reenvía al exchange tópico `fleetcore.events` con claves como `vehicle.created`.
- `MessagingService` envuelve `AmqpConnection` con políticas de reintento y circuit breaker (impulsadas por `ResilienceService`).
- `VehicleEventsConsumer` demuestra el consumo y logging de esos eventos, sirviendo como plano para servicios downstream.

## Logging y métricas

- El `Logger` de NestJS registra reintentos, disparos del circuit breaker y fallbacks de auditoría.
- `DomainMetricsService` incrementa contadores por evento, abriendo el camino para integrar Prometheus/Grafana.

## Configurabilidad

- Las variables de entorno controlan secretos (`JWT_SECRET`), TTLs, endpoints de RabbitMQ/Mongo y feature flags.
- `FeatureToggleService` permite desactivar caché, eventos de dominio o el worker de auditoría asíncrona sin cambios en el código (útil para depuración o entornos limitados).

## Por qué importa

- La autenticación puede revocarse por sesión sin invalidar todos los tokens.
- Cada acción es auditable a través de HTTP, RabbitMQ y MongoDB.
- La mensajería asegura integraciones desacopladas (notificaciones, analítica, etc.) mientras los mecanismos de resiliencia protegen frente a incidencias de la infraestructura.
