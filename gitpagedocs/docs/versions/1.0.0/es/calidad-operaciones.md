# Calidad y Operaciones

Resumen de las rutinas automatizadas y operativas que sostienen la plataforma.

## Calidad

- `npm run lint`, `npm test`, `npm run test:e2e` como puertas compartidas.
- Cobertura Jest sobre servicios, guards e integraciones HTTP, incluidas las suites de sesiones (`auth-session`), lock distribuido, idempotencia, rate limit y resiliencia (fallback/rollback).
- Playwright valida escenarios críticos de UI.

## Operaciones

- Docker Compose levanta SQL Server (+ servicio `sqlserver-init`), Redis, RabbitMQ, MongoDB, API, frontend y el worker `audit-worker` (consumidor de `fleetcore.audit`, concurrencia vía `WORKER_CONCURRENCY`).
- `npm run generate:openapi` y `npm run export:schemas` sincronizan documentación y validaciones.
- Feature toggles permiten ajustar caché, auditoría y eventos según el ambiente; el rate limit se controla con `RATE_LIMIT_*` y el lock distribuido con `REDIS_LOCK_TTL`.

## Referencias

- **Calidad y Pruebas**
- **Runbook y Resolución de Problemas**
