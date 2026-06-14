# Preguntas Conceptuales

Respuestas breves a dudas frecuentes durante la revisión técnica.

## ¿Por qué usar DDD y módulos aislados?

Mantiene contextos delimitados, facilita pruebas y permite escalar capacidades (flota, auth, auditoría, mensajería) sin efectos colaterales. Consulta la sección Arquitectura Backend para más detalles.

## ¿Cómo se revocan sesiones sin invalidar todos los tokens?

`AuthSessionService` guarda identificadores de sesión en Redis con TTL y los elimina al hacer logout, de modo que los guards rechazan tokens caducados. El TTL es **deslizante** (`refresh` en cada petición válida) y una sesión puede **bloquearse** (`lock`/`unlock`/`isLocked`), devolviendo 401 mientras esté bloqueada. Más detalles en la sección Seguridad, Auditoría y Mensajería.

## ¿Cómo se protege la base de datos ante duplicados, carreras y abuso?

Con una capa Redis aditiva: idempotencia (`IdempotencyService` + header `Idempotency-Key`, 409 ante duplicados), lock distribuido (`RedisLockService` con `SET NX` y liberación validada por token), caché de lectura y un rate limit dedicado (`RateLimitGuard`, 429 por usuario/IP/endpoint). La estructura y el flujo previos se mantuvieron.

## ¿Cómo comparten validaciones el frontend y el backend?

Los esquemas Zod se generan en el backend (`npm run export:schemas`) y se importan en el FSD para mensajes consistentes. Revisa la sección Frontend y Experiencia.

## ¿Qué habilita la observabilidad?

Logging estructurado, auditoría enriquecida en MongoDB (con `correlationId`, `requestId`, `sessionId`, `statusCode` y metadatos del worker), eventos RabbitMQ y métricas de dominio permiten investigar incidentes y crear alertas. El worker `audit-worker` consume `fleetcore.audit` de forma asíncrona. Amplía en la sección Calidad y Pruebas.
