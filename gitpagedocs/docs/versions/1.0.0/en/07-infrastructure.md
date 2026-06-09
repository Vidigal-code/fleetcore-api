# Infrastructure and Deployment

The project runs smoothly either inside Docker or directly on the host. This section summarises the moving parts and scripts.

## Docker Compose stack

`docker-compose.yml` orchestrates the full environment:

- `sqlserver` — official 2022 Developer image with persistent volume and configurable password.
- `redis` — append-only mode; used for caching and session storage.
- `mongo` — persists the audit trail.
- `rabbitmq` — broker with management UI (`15672`).
- `backend` — NestJS app built through a multistage `backend/Dockerfile`; depends on all data services.
- `frontend` — Next.js app (multistage `frontend/Dockerfile`) served on port 3001.

## Environment variables

- Root `.env.example` provides shared values for backend and frontend (`SQLSERVER_*`, `JWT_SECRET`, `AUTH_SESSION_TTL_SECONDS`, `NEXT_PUBLIC_*`).
- `backend/.env.sample` and `frontend/.env.sample` illustrate stand-alone runs.
- New additions: `AUTH_SESSION_TTL_SECONDS` (Redis sessions) and `NEXT_PUBLIC_START_THEME` (default theme).

## Helpful scripts

| Command | Description |
|---------|-------------|
| `npm run build` / `npm run start:prod` (backend) | Production build/start.
| `npm run generate:openapi` | Generates Swagger JSON artefacts.
| `npm run export:schemas` | Exports Zod schemas to the frontend.
| `npm run dev` (frontend) | Starts Next.js with HMR.
| `npm run lint`, `npm test`, `npm run test:e2e` | Quality gates for both apps.

## Documentation (GitPageDocs)

- The `gitpagedocs/` folder powers this documentation site.
- Site settings were updated to mirror the challenge (PT/EN languages, new navigation, no audio/video extras).
- Can be published through GitHub Pages (`https://vidigal-code.github.io/fleetcore-api/`).

## Observability

- NestJS logs highlight retries, circuit breaker openings and audit fallbacks.
- Audit data stored in MongoDB; RabbitMQ provides a full event trail.
- Domain metrics allow straightforward integration with Prometheus/Grafana.

## Recommended deployment flow

1. Copy `.env.example` to `.env` and adjust secrets.
2. Execute `docker compose up --build`.
3. Access `http://localhost:3000/api` (API), `/docs` (Swagger EN), `/docs-pt` (Swagger PT-BR), `http://localhost:3001` (frontend) and `http://localhost:15672` (RabbitMQ).

This setup satisfies the challenge requirements and is ready to be ported to cloud-native environments if needed.
