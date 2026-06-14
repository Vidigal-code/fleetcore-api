# Infraestructura y Despliegue

El proyecto puede ejecutarse sin fricciones dentro de Docker o directamente en la máquina host. Esta sección resume los componentes y scripts clave.

## Stack Docker Compose

`docker-compose.yml` orquesta todo el entorno:

- `sqlserver` — imagen oficial 2022 Developer con volumen persistente y contraseña configurable.
- `sqlserver-init` — servicio de inicialización que crea la base `fleetcore` ejecutando `docker/sqlserver/init.sql`.
- `redis` — modo append-only; se utiliza para caché y almacenamiento de sesiones.
- `mongo` — persiste la traza de auditoría.
- `rabbitmq` — broker con interfaz de administración (`15672`).
- `backend` — app NestJS construida con `backend/Dockerfile` multietapa; depende de todos los servicios de datos.
- `audit-worker` — mismo imagen del backend, arrancado con `node dist/src/apps/audit-worker/main.js`; consume la cola `fleetcore.audit` y escribe la traza de auditoría en MongoDB. Su concurrencia (`prefetchCount`) se controla con `WORKER_CONCURRENCY`.
- `frontend` — app Next.js (multietapa `frontend/Dockerfile`) servida en el puerto 3001.

## Variables de entorno

- Existe un **único `.env` en la raíz**, copiado de `envexample.txt`, que provee los valores compartidos para backend y frontend (`SQLSERVER_*`, `JWT_SECRET`, `AUTH_SESSION_TTL_SECONDS`, `NEXT_PUBLIC_*`).
- `backend/envexample.txt` ilustra la ejecución independiente del backend.
- Novedades de sesión/tema: `AUTH_SESSION_TTL_SECONDS` (sesiones Redis con TTL deslizante) y `NEXT_PUBLIC_START_THEME` (tema por defecto).
- Variables aditivas de resiliencia, worker, lock y rate limit (nombres existentes preservados):
  - Lock distribuido: `REDIS_LOCK_TTL=30`.
  - Worker de auditoría: `WORKER_CONCURRENCY=2`, `RABBITMQ_RETRY_QUEUE=fleetcore.retry`, `RABBITMQ_DLQ=fleetcore.dead-letter`.
  - Rate limit Redis: `RATE_LIMIT_ENABLED=true`, `RATE_LIMIT_WINDOW_SECONDS=60`, `RATE_LIMIT_MAX_REQUESTS=100`, `RATE_LIMIT_AUTH_MAX_REQUESTS=10`, `RATE_LIMIT_AUTH_WINDOW_SECONDS=60`.
  - Reintentos: `RETRY_MAX_ATTEMPTS=5`, `RETRY_INITIAL_DELAY=1000`.

## Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `npm run build` / `npm run start:prod` (backend) | Build y arranque productivo.
| `npm run generate:openapi` | Genera artefactos Swagger JSON.
| `npm run export:schemas` | Exporta esquemas Zod al frontend.
| `npm run dev` (frontend) | Inicia Next.js con HMR.
| `npm run lint`, `npm test`, `npm run test:e2e` | Puertas de calidad para ambas apps.

## Documentación (GitPageDocs)

- La carpeta `gitpagedocs/` alimenta este sitio documental.
- No existe `package.json` en la raíz del repositorio: el sitio se construye y publica automáticamente mediante el workflow de GitHub Actions `.github/workflows/gitpagedocs-pages.yml`.
- Publicado en GitHub Pages: `https://vidigal-code.github.io/fleetcore-api/`.

## Observabilidad

- Los logs de NestJS resaltan reintentos, aperturas del circuit breaker y fallbacks de auditoría.
- Los datos de auditoría viven en MongoDB (enriquecidos con `correlationId`/`requestId`/`sessionId`/`statusCode` y metadatos del worker como `status`, `retries`, `processedAt`); RabbitMQ ofrece una traza completa de eventos a través de la cola `fleetcore.audit` y las colas auxiliares `fleetcore.retry` y `fleetcore.dead-letter`.
- Las métricas de dominio permiten integrar fácilmente Prometheus/Grafana.

## Flujo de despliegue recomendado

1. Copia `envexample.txt` a `.env` y ajusta secretos.
2. Ejecuta `docker compose up --build`.
3. Accede a `http://localhost:3000/api` (API), `/docs` (Swagger EN), `/docs-pt` (Swagger PT-BR), `http://localhost:3001` (frontend) y `http://localhost:15672` (RabbitMQ).

Esta configuración satisface los requisitos del desafío y está lista para migrar a entornos cloud-native si es necesario.
