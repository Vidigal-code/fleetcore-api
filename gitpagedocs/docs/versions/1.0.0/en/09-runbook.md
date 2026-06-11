# Runbook and Troubleshooting

Operational quick-start for reviewers and maintainers.

## 1. Prepare environment variables

```bash
cp envexample.txt .env
```

Edit the new `.env` and configure:

- `SQLSERVER_*` credentials (user, password, host, port)
- `REDIS_HOST`, `RABBITMQ_URI`, `AUDIT_MONGO_URI`
- `JWT_SECRET`, `AUTH_SESSION_TTL_SECONDS`, `FEATURE_FLAGS_*`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_START_THEME`

## 2. Start with Docker Compose

```bash
docker compose up --build
```

Endpoints:

- API: `http://localhost:3000/api`
- Swagger EN/PT: `http://localhost:3000/docs` and `/docs-pt`
- Frontend: `http://localhost:3001`
- RabbitMQ UI: `http://localhost:15672`
- Mongo Express (if enabled): connect directly to the Mongo container

Seed admin credentials: `aivacol` / `aivacol123!`

## 3. Run without Docker (optional)

```bash
# Backend
cd backend
npm install
npm run start:dev    # or start:prod

# Frontend
cd ../frontend
npm install
npm run dev
```

Ensure SQL Server, Redis, RabbitMQ and MongoDB services are reachable (local or managed).

## 4. Maintenance commands

- `npm run generate:openapi` — regenerate the branded bilingual Swagger specs.
- `npm run export:schemas` — synchronise backend validation with the frontend.
- `npm run lint`, `npm test`, `npm run test:e2e` — execute quality gates.

> The documentation site is rebuilt and published to GitHub Pages automatically by the `.github/workflows/gitpagedocs-pages.yml` workflow — there is no root `npm` script for it.

## 5. Troubleshooting matrix

| Symptom | Action |
|---------|--------|
| API cannot connect to SQL Server | Recheck `SQLSERVER_*` values and container status (`docker compose ps`). |
| Frequent `401 Unauthorized` | Inspect Redis container; clear the session (`AUTH_SESSION_TTL_SECONDS`) and re-login. |
| Audit docs missing in Mongo | Tail `backend` logs; ensure `FEATURE_FLAGS_AUDIT_ASYNC_WORKER` is true and RabbitMQ is reachable. |
| Domain events not emitted | Confirm `FEATURE_FLAGS_DOMAIN_EVENTS=true` and RabbitMQ credentials in `.env`. |
| Cache not refreshing | Toggle `FEATURE_FLAGS_REPOSITORY_CACHE`; clear Redis keys (`fleetcore:cache:*`). |
| Theme stuck on light | Set `NEXT_PUBLIC_START_THEME=dark` and remove `fleetcore.theme-preference` from localStorage. |

## 6. Helpful references

- Swagger UIs (`/docs`, `/docs-pt`)
- Package scripts (`backend/package.json`, `frontend/package.json`)
- `docs/versions/1.0.0` in GitPagedocs for architecture deep dives

Following this checklist you can bootstrap, validate and debug the fleet platform end to end in minutes.
