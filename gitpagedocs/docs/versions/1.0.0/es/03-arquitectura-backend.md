# Arquitectura Backend

El backend se basa en **NestJS 11** con un diseño modular orientado al dominio. Se mantienen límites claros de responsabilidad, lo que hace que el código sea mantenible y altamente testeable.

## Panorama de módulos

- `apps/api` — bootstrap HTTP; registra guards globales (`JwtAuthGuard`, `RolesGuard`, `ThrottlerGuard`) y el interceptor de auditoría.
- `modules/auth` — autenticación, emisión/validación de JWT, `AuthSessionService` (Redis) y endpoints HTTP (`login`, `register`, `logout`, `me`).
- `modules/fleet` — dominio de flota (marcas, modelos, vehículos) con servicios, agregados y eventos de dominio.
- `modules/audit` — interceptores, servicio de auditoría y escritor en MongoDB (`AuditWriterService`).
- `modules/messaging` — integración con RabbitMQ vía `@golevelup/nestjs-rabbitmq` y el consumidor de eventos de vehículos.
- `modules/users` — seed del admin (`aivacol`) y operaciones del repositorio de usuarios.
- `shared` — preocupaciones transversales (caché, feature toggles, unit of work, métricas, resiliencia, objetos de configuración).

## Enfoque por capas

1. **Interfaz**: controllers + DTOs (por ejemplo, `vehicles.controller.ts`) validan peticiones con `class-validator` y esquemas derivados de Zod.
2. **Aplicación**: servicios (por ejemplo, `vehicles.service.ts`) orquestan reglas, transacciones (`UnitOfWork`), auditoría y eventos de dominio.
3. **Dominio**: agregados (`Vehicle`, `Model`, `Brand`) garantizan invariantes, mientras que los eventos (`VehicleCreatedEvent`) capturan snapshots.
4. **Infraestructura**: repositorios TypeORM convierten agregados en entidades persistentes; los adaptadores encapsulan Redis/Mongo/RabbitMQ.

## Resiliencia y feature flags

- `ResilienceService` ofrece políticas de reintento, circuit breaker y timeout para llamadas externas (mensajería/auditoría).
- `FeatureToggleService` lee banderas (`auditAsyncWorker`, `domainEvents`, `repositoryCache`, `swaggerDocs`) para habilitar comportamientos por ambiente.
- `DomainMetricsService` incrementa contadores por evento publicado.

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
- Permite pruebas granulares (servicios inyectados vía DI; e2e cubre flujos HTTP reales usando SQLite en memoria).
- Añade ganchos de resiliencia para servicios externos poco confiables.
