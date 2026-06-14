# Back-end

Referencia rápida de la API NestJS, sus reglas de negocio y mecanismos de soporte.

## Endpoints clave

- CRUD de marcas, modelos y vehículos en `fleet/interfaces/http`.
- Rutas de autenticación (`/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me`).
- Swagger disponible en `/docs` (EN) y `/docs-pt` (PT-BR), con tema oscuro de la identidad Fleetcore, "Try it out" habilitado, ejemplos bilingües (PT/EN) en cada DTO y el cuerpo de `POST /auth/login` precargado con las credenciales seed (`aivacol` / `aivacol123!`).

## Reglas de negocio

- Servicios (`models.service.ts`, `vehicles.service.ts`) validan relaciones y emiten eventos de dominio.
- Caché Redis acelera búsquedas e invalida automáticamente após mutaciones.
- Las operaciones críticas se protegen con lock distribuido (`RedisLockService`), idempotencia (`Idempotency-Key`, 409 ante duplicados) y rate limit dedicado (429 por usuario/IP/endpoint). Las sesiones Redis usan TTL deslizante y soportan bloqueo.
- RabbitMQ transmite cambios significativos a consumidores downstream; la auditoría enriquecida se procesa de forma asíncrona por el worker `audit-worker`.

## Profundiza

- **Arquitectura Backend**
- **Modelado de Datos y Dominio**
- **Seguridad, Auditoría y Mensajería**
