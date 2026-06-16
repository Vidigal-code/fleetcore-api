# Seguridad, Auditoría y Mensajería

La seguridad y la observabilidad se trataron como preocupaciones de primera clase. Autenticación, auditoría y mensajería trabajan juntas para ofrecer trazabilidad y confiabilidad. Los mecanismos descritos a continuación son **aditivos**: la estructura y el flujo originales se preservaron y se reforzaron con sesiones deslizantes, locks distribuidos, idempotencia, rate limit dedicado y auditoría enriquecida.

## Autenticación y autorización

- **JWT + RBAC**: `AuthController` expone `POST /auth/login`, `POST /auth/register`, `POST /auth/logout` y `GET /auth/me`. `JwtAuthGuard` valida tokens, mientras que `RolesGuard` aplica el control de acceso basado en roles.
- **Sesiones respaldadas en Redis (TTL deslizante + lock)**: `AuthSessionService` (`backend/src/modules/auth/application/auth-session.service.ts`) emite un `sessionId` UUID y expone `store`/`revoke`/`isActive` junto con `refresh()` (renueva el TTL — *sliding session*), `lock()`/`unlock()`/`isLocked()`. `JwtStrategy` renueva el TTL en cada petición válida y rechaza con **401** las sesiones bloqueadas. La sesión activa vive **solo en Redis** (claves `auth.sessions:{sessionId}` y `auth.sessions.lock:{sessionId}`, TTL vía `AUTH_SESSION_TTL_SECONDS`); MongoDB guarda únicamente la auditoría.
- **Sanitización y rate limiting**: `SanitizeInputPipe` elimina caracteres de control. Sobre el `ThrottlerGuard` base de `@nestjs/throttler` (que permanece) opera un **guard Redis dedicado** (`RateLimitGuard` + `RateLimitService`, `backend/src/apps/api/security/`), registrado de forma global. Las claves se segmentan por usuario, IP y endpoint (`ratelimit:user:{id}`, `ratelimit:ip:{ip}`, `ratelimit:endpoint:{ruta}`). Por defecto 100 peticiones/60 s; `POST /auth/login` queda en 10/60 s mediante el decorador `@AuthRateLimit()`. Al excederse responde **429** con JSON `{ "success": false, "message": "Rate limit exceeded", "retryAfter": <s> }` y los intentos bloqueados se auditan con `eventType` `rate_limit.blocked`. Se configura vía `RATE_LIMIT_ENABLED`, `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_AUTH_MAX_REQUESTS` y `RATE_LIMIT_AUTH_WINDOW_SECONDS`.

## Protección de la base con Redis

Las operaciones críticas atraviesan una capa de protección respaldada en Redis antes de tocar la base de datos:

- **Caché de lectura**: `RepositoryCacheService.fetch`/`invalidate` evita golpear la base en lecturas repetidas e invalida tras mutaciones.
- **Idempotencia**: el nuevo `IdempotencyService` (`markIdempotencyKey`/`isDuplicate`) junto al `IdempotencyInterceptor` lee el header `Idempotency-Key` en mutaciones y responde **409** ante duplicados, evitando reejecutar la misma operación.
- **Lock distribuido**: el nuevo `RedisLockService` (`backend/src/shared/cache/redis-lock.service.ts`) ofrece `acquireLock` (`SET NX EX`), `releaseLock` (script Lua *compare-and-del* que valida el token dueño), `renewLock` (Lua *compare-and-pexpire*) y el helper `withLock`. Así se evita el *deadlock* y que un proceso libere el lock de otro. TTL vía `REDIS_LOCK_TTL` (por defecto 30 s).
- **Rate limit**: descrito arriba, protege endpoints frente a abuso y picos.

## Traza de auditoría en MongoDB

- El `AuditInterceptor` audita **toda ruta no pública**, asigna un `correlationId` y, cuando el toggle `auditAsyncWorker` está activo (por defecto), publica el evento en RabbitMQ con la routing key `audit.event` (cola `fleetcore.audit`). Si el toggle está apagado, escribe sincrónicamente directo en la colección `audit_events` de Mongo (`persistInline`).
- El evento de auditoría es ahora más rico: además de `action`/`entity`/`entityId`/`actor`/`payload`/`metadata`/`occurredAt`, incluye `eventId`, `eventType`, `correlationId`, `requestId`, `userId`, `sessionId`, `method`, `route`, `statusCode` y `success`.
- El proceso `apps/audit-worker` (consumidor asíncrono) persiste los documentos en la colección `audit_events` de MongoDB vía Mongoose. El esquema añade los campos anteriores más metadatos de procesamiento escritos por el worker: `status='processed'`, `retries`, `sourceQueue` y `processedAt`. La persistencia usa `ResilienceService` (retry/circuit breaker).
- **Outbox transaccional (fallback ante caída del broker)**: si `MessagingService.publish` falla incluso tras la política de resiliencia, `AuditService` guarda el evento en la colección `audit_outbox` como `pending` (`AuditOutboxService`) en lugar de escribir directo en el destino final. El `AuditOutboxRelayService` —activo **solo en el audit-worker**— reclama periódicamente una entrada pendiente a la vez (`findOneAndUpdate` → `processing`) y la **republica en RabbitMQ**; al éxito la elimina, al fallo la devuelve a `pending` (o la aparca como `failed` tras `AUDIT_OUTBOX_MAX_ATTEMPTS`). Cuando el broker se recupera, las entradas vuelven al flujo normal (consumidor → MongoDB); las dejadas en `processing` por un relay caído se reencolan en el arranque. Como última red de seguridad (p. ej. Mongo también inaccesible) queda una escritura síncrona directa, de modo que ningún evento se descarta en silencio. Ajustable con `AUDIT_OUTBOX_RELAY_INTERVAL_MS` (por defecto `5000`), `AUDIT_OUTBOX_BATCH_SIZE` (`20`) y `AUDIT_OUTBOX_MAX_ATTEMPTS` (`10`).
- **Retry y dead-letter en el consumidor (fallback ante caída de Mongo)**: el outbox protege el lado de la publicación; el consumidor protege el lado del consumo. La cola `fleetcore.audit` se declara con dead-letter hacia `fleetcore.retry`. Cuando `AuditWriterService.persist` falla, `AuditEventsConsumer` relanza el error con `errorBehavior: NACK` (nack sin requeue), por lo que el mensaje se dead-letterea a la cola de retry. `fleetcore.retry` lo retiene durante `RABBITMQ_RETRY_DELAY_MS` (por defecto `10000`) vía `x-message-ttl` y lo devuelve a `fleetcore.audit` —es decir, retry con retardo, evitando un bucle de reprocesamiento mientras Mongo está caído. El número de intentos se lee del header `x-death`; al alcanzar `RABBITMQ_AUDIT_MAX_ATTEMPTS` (por defecto `5`) el consumidor publica el mensaje en la cola `fleetcore.dead-letter` y lo confirma (ack), deteniendo el ciclo y preservando el evento para inspección manual. **Nota operativa**: la cola `fleetcore.audit` ahora lleva argumentos de dead-letter; si ya existe en el broker con argumentos distintos, `assertQueue` falla con `PRECONDITION_FAILED` —en dev, elimina la cola para que se recree con la nueva configuración.
- Los esquemas viven en `backend/src/modules/audit/schemas`, manteniendo el log de auditoría consultable.

## Mensajería RabbitMQ

- `FleetDomainEventListener` escucha eventos de dominio y los reenvía al exchange tópico `fleetcore.events` con claves como `vehicle.created`.
- La integración de mensajería usa `@golevelup/nestjs-rabbitmq` sobre un exchange topic (`RABBITMQ_EXCHANGE=fleetcore.events`) con políticas de reintento y circuit breaker (cockatiel, impulsadas por `ResilienceService`).
- Los consumidores `vehicle-events` y `audit-events` demuestran el consumo y logging de esos eventos, sirviendo como plano para servicios downstream.
- El worker de auditoría (`apps/audit-worker`) consume la cola `fleetcore.audit`. Su concurrencia se controla con `WORKER_CONCURRENCY` (por defecto 2), que define el `prefetchCount` de RabbitMQ; la app registra la concurrency efectiva en el arranque. Las colas de reintento y *dead-letter* (`RABBITMQ_RETRY_QUEUE=fleetcore.retry`, `RABBITMQ_DLQ=fleetcore.dead-letter`) están **activas**: la `fleetcore.audit` hace dead-letter a la de retry (con `x-message-ttl=RABBITMQ_RETRY_DELAY_MS`) y, tras `RABBITMQ_AUDIT_MAX_ATTEMPTS`, el evento se aparca en la dead-letter.

## Resiliencia: retry, fallback y rollback

- `ResilienceService` ofrece `executeWithRetry` (reintentos con backoff, parametrizable vía `RETRY_MAX_ATTEMPTS` y `RETRY_INITIAL_DELAY`), `executeWithFallback` (ante un error controlado ejecuta una ruta alternativa) y `executeWithRollback` (ejecuta una secuencia de pasos y, ante fallo, dispara las compensaciones en orden inverso).
- `UnitOfWork` permanece como el mecanismo de rollback transaccional de la base de datos. Ambos enfoques son complementarios: `UnitOfWork` para transacciones SQL, `executeWithRollback` para compensar pasos distribuidos (Redis/Rabbit/Mongo).

## Logging y métricas

- El `Logger` de NestJS registra reintentos, disparos del circuit breaker y fallbacks de auditoría.
- `DomainMetricsService` incrementa contadores por evento, abriendo el camino para integrar Prometheus/Grafana.

## Configurabilidad

- Las variables de entorno controlan secretos (`JWT_SECRET`), TTLs, endpoints de RabbitMQ/Mongo y feature flags.
- `FeatureToggleService` permite desactivar caché, eventos de dominio o el worker de auditoría asíncrona sin cambios en el código (útil para depuración o entornos limitados).

## Por qué importa

- La autenticación puede revocarse o **bloquearse** por sesión sin invalidar todos los tokens, y el TTL deslizante mantiene viva la sesión mientras el usuario está activo.
- La idempotencia, el lock distribuido y el rate limit protegen la base de datos frente a duplicados, condiciones de carrera y abuso.
- Cada acción es auditable a través de HTTP, RabbitMQ y MongoDB, con eventos enriquecidos (`correlationId`, `requestId`, `sessionId`, `statusCode`…) y metadatos de procesamiento del worker.
- La mensajería asegura integraciones desacopladas (notificaciones, analítica, etc.) mientras los mecanismos de resiliencia (retry/fallback/rollback) protegen frente a incidencias de la infraestructura.
