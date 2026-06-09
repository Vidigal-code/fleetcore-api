# Calidad y Pruebas

Las puertas de calidad automatizadas eran un requisito central. La solución ofrece cobertura amplia para backend y frontend, además de linting y salvaguardas de resiliencia.

## Backend (Jest)

- **Pruebas unitarias** (`backend/tests/unit`) cubren servicios de flota, flujos de auth, lógica de auditoría, feature toggles y repositorios usando colaboradores mockeados.
- **Integración / e2e** (`backend/tests/e2e`) ejecuta sobre SQLite en memoria, validando flujos HTTP reales para vehículos y seguridad.
- **Comandos**:
  - `npm run lint`
  - `npm test`
  - `npm run test:e2e`
  - `npm run test:cov`

## Frontend (Jest + Playwright)

- **Pruebas unitarias** (`frontend/tests/unit`) verifican reducers de Redux y hooks críticos.
- **Playwright e2e** (`frontend/tests/e2e`) asegura la página de login y el comportamiento del shell principal.
- **Comandos**:
  - `npm run lint`
  - `npm test`
  - `npm run test:e2e`

## Calidad continua

- ESLint (Next.js + TypeScript) impone patrones consistentes en ambas aplicaciones.
- La exportación de esquemas (`npm run export:schemas`) mantiene sincronizadas las reglas de validación entre backend y frontend.
- Los feature toggles y envoltorios de resiliencia evitan comportamientos inestables cuando los servicios externos fallan.

## Observabilidad

- El logging de NestJS destaca reintentos, eventos del circuit breaker y fallbacks de auditoría.
- MongoDB + RabbitMQ conservan la traza completa para análisis post-mortem.
- Las métricas de dominio habilitan una integración sencilla con stacks de monitoreo.

Resultado: cada entrega pasa por linting y pruebas automatizadas, marcando las casillas de “Automated tests” y “Quality” del desafío.
