# Calidad y Operaciones

Resumen de las rutinas automatizadas y operativas que sostienen la plataforma.

## Calidad

- `npm run lint`, `npm test`, `npm run test:e2e` como puertas compartidas.
- Cobertura Jest sobre servicios, guards e integraciones HTTP.
- Playwright valida escenarios críticos de UI.

## Operaciones

- Docker Compose levanta SQL Server, Redis, RabbitMQ, MongoDB, API y frontend.
- `npm run generate:openapi` y `npm run export:schemas` sincronizan documentación y validaciones.
- Feature toggles permiten ajustar caché, auditoría y eventos según el ambiente.

## Referencias

- **Calidad y Pruebas**
- **Runbook y Resolución de Problemas**
