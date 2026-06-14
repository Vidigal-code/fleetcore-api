# Arquitectura Backend

El backend se basa en **NestJS 11** con un diseño modular orientado al dominio. Se mantienen límites claros de responsabilidad, lo que hace que el código sea mantenible y altamente testeable.

## Panorama de módulos

- `apps/api` — bootstrap HTTP; registra guards globales (`JwtAuthGuard`, `RolesGuard`, `ThrottlerGuard`, `RateLimitGuard`) y los interceptores de auditoría e idempotencia. La seguridad dedicada vive en `apps/api/security/` (`RateLimitService`, `RateLimitGuard`, decorador `@AuthRateLimit()`).
- `apps/audit-worker` — proceso consumidor independiente que lee la cola `fleetcore.audit` y persiste la auditoría en MongoDB; su concurrencia (`prefetchCount`) se rige por `WORKER_CONCURRENCY`.
- `modules/auth` — autenticación, emisión/validación de JWT, `AuthSessionService` (Redis, con TTL deslizante vía `refresh` y bloqueo vía `lock`/`unlock`/`isLocked`) y endpoints HTTP (`login`, `register`, `logout`, `me`).
- `modules/fleet` — dominio de flota (marcas, modelos, vehículos) con servicios, agregados y eventos de dominio.
- `modules/audit` — interceptores, servicio de auditoría y escritor en MongoDB (`AuditWriterService`); eventos enriquecidos con `correlationId`/`requestId`/`sessionId`/`statusCode`.
- `modules/messaging` — integración con RabbitMQ vía `@golevelup/nestjs-rabbitmq` y el consumidor de eventos de vehículos.
- `modules/users` — seed del admin (`aivacol`) y operaciones del repositorio de usuarios.
- `shared` — preocupaciones transversales: caché (`RepositoryCacheService`), lock distribuido (`RedisLockService` en `shared/cache`), idempotencia (`IdempotencyService`), feature toggles, unit of work, métricas, resiliencia (`ResilienceService`) y objetos de configuración.

## Enfoque por capas

1. **Interfaz**: controllers + DTOs (por ejemplo, `vehicles.controller.ts`) validan peticiones con `class-validator` y esquemas derivados de Zod.
2. **Aplicación**: servicios (por ejemplo, `vehicles.service.ts`) orquestan reglas, transacciones (`UnitOfWork`), auditoría y eventos de dominio.
3. **Dominio**: agregados (`Vehicle`, `Model`, `Brand`) garantizan invariantes, mientras que los eventos (`VehicleCreatedEvent`) capturan snapshots.
4. **Infraestructura**: repositorios TypeORM convierten agregados en entidades persistentes; los adaptadores encapsulan Redis/Mongo/RabbitMQ.

## Resiliencia y feature flags

- `ResilienceService` ofrece políticas de reintento, circuit breaker y timeout para llamadas externas (mensajería/auditoría), más los helpers `executeWithRetry`, `executeWithFallback` (ruta alternativa ante error controlado) y `executeWithRollback` (compensaciones en orden inverso ante fallo). `UnitOfWork` permanece como rollback transaccional de la base.
- `FeatureToggleService` lee banderas (`auditAsyncWorker`, `domainEvents`, `repositoryCache`, `swaggerDocs`) para habilitar comportamientos por ambiente.
- `DomainMetricsService` incrementa contadores por evento publicado.

> Todos estos servicios son **aditivos**: la estructura modular y el flujo de petición existentes se preservaron; las protecciones (sesiones deslizantes, lock, idempotencia, rate limit, auditoría enriquecida) se sumaron sin alterar la arquitectura previa.

## Flujo de una petición

1. La petición ingresa al pipeline → `SanitizeInputPipe` la limpia → los guards autentican/autorizan.
2. El controller delega al servicio correspondiente; `UnitOfWork` ejecuta la lógica transaccional.
3. El servicio persiste agregados, registra eventos de auditoría, invalida la caché Redis y levanta eventos de dominio.
4. `FleetDomainEventListener` reacciona a los eventos, incrementa métricas y reenvía payloads a RabbitMQ cuando está habilitado.

## Configuración

Archivos tipados en `shared/config` (`app`, `database`, `redis`, `jwt`, `auth`, `audit`, `messaging`, `swagger`, `feature-toggle`, `resilience`) consolidan variables de entorno. `AppConfigService` expone getters con valores seguros validados por `env.validation.ts`.

## Por qué satisface el desafío

- Escala horizontalmente (API sin estado + Redis + RabbitMQ).
- Mantiene la lógica de dominio aislada de los detalles de infraestructura.
- Permite pruebas granulares (servicios inyectados vía DI; unit + integración de búsqueda/orden de vehículos + e2e que cubre flujos HTTP reales).
- Añade ganchos de resiliencia para servicios externos poco confiables.
