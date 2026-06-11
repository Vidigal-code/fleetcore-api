# Infrastructure and Deployment

The repository ships with everything needed to run the platform locally or in CI: Docker images, environment templates, scripts and documentation builders.

## Docker Compose services

`docker-compose.yml` provisions the full stack:

- `sqlserver` — Microsoft SQL Server 2022 Developer edition with persistent volume and credentials from `SQLSERVER_*` env vars.
- `sqlserver-init` — one-shot init job that creates the `fleetcore` database via `docker/sqlserver/init.sql`.
- `redis` — Redis 7 in append-only mode to store sessions and cached queries.
- `mongo` — MongoDB for the audit fallback worker.
- `rabbitmq` — RabbitMQ with management UI exposed on `15672`.
- `backend` — Multistage Nest build defined in `backend/Dockerfile`; depends on the data services above.
- `frontend` — Multistage Next.js build (`frontend/Dockerfile`) serving the web client on `3001`.

## Environment configuration

- Copy `envexample.txt` → `.env` (a single root `.env`) to run the compose stack; it exposes shared variables for both apps (SQL Server, Redis, RabbitMQ, Mongo, JWT, feature flags, theme settings).
- A `backend/envexample.txt` also exists for standalone backend execution without Docker.
- Key variables:
  - `AUTH_SESSION_TTL_SECONDS`, `JWT_SECRET`, `FEATURE_FLAGS_*` control security behaviour.
  - `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_START_THEME` configure the frontend runtime.
  - `AUDIT_MONGO_URI`, `RABBITMQ_URI` wire audit/messaging.

## Build & tooling scripts

| Command | Location | Purpose |
|---------|----------|---------|
| `npm run start:dev` / `npm run start:prod` | `backend/` | Run Nest API (watch or production). |
| `npm run generate:openapi` | `backend/` | Rebuild the branded bilingual Swagger docs (`/docs` en-US, `/docs-pt` pt-BR). |
| `npm run export:schemas` | `backend/` | Export Zod schemas to `frontend/src/shared/schemas`. |
| `npm run lint`, `npm test`, `npm run test:e2e` | `backend/` | Lint, unit/integration tests, e2e tests with SuperTest. |
| `npm run dev`, `npm run build`, `npm start` | `frontend/` | Next.js development and production builds. |
| `npm run test`, `npm run test:e2e` | `frontend/` | Unit tests (RTL) and the Playwright login spec. |

## Documentation pipeline

- GitPageDocs configuration lives under `gitpagedocs/`; multilingual content is stored in `docs/versions/1.0.0/{pt,en,es}`.
- There is no root `package.json`: the docs site is built and published to GitHub Pages by the GitHub Actions workflow `.github/workflows/gitpagedocs-pages.yml`, live at `https://vidigal-code.github.io/fleetcore-api/`.

## Observability hooks

- NestJS logging surfaces resilience retries, audit fallbacks and domain event publishing failures.
- Audit payloads persist in MongoDB for post-mortem analysis, and RabbitMQ retains message history when durable queues are enabled.
- `DomainMetricsService` exposes counters that can be scraped by Prometheus when the optional exporter is attached.

## Typical local workflow

1. `cp envexample.txt .env` and adjust secrets.
2. `docker compose up --build` to start all services.
3. Visit `http://localhost:3000/api` (API), `/docs` (Swagger EN), `/docs-pt` (Swagger PT-BR), `http://localhost:3001` (frontend) and `http://localhost:15672` (RabbitMQ console).

The same compose stack is used in CI smoke tests, making it straightforward to deploy the platform to other environments or cloud-managed services.
