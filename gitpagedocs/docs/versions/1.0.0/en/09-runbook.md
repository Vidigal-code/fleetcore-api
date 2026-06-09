# Runbook and Troubleshooting

## 1. Prepare environment variables

```bash
cp .env.example .env
```

Key settings:

- `SQLSERVER_*` credentials
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS`
- `RABBITMQ_URI`, `MONGO_URI`, `REDIS_*`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_START_THEME`

## 2. Boot the Docker stack

```bash
```

Services:

- API: `http://localhost:3000/api`
- Swagger EN: `http://localhost:3000/docs`
- Swagger PT-BR: `http://localhost:3000/docs-pt`
- Frontend: `http://localhost:3001`
- RabbitMQ UI: `http://localhost:15672`

Seed admin: `aivacol` / `aivacol123!`

## 3. Manual execution (without Docker)

```bash
# Backend
cd backend
npm install
npm run build
npm run start:prod

# Frontend
cd frontend
npm install
npm run dev
```

Ensure SQL Server, Redis, RabbitMQ and MongoDB are available locally or as managed services.

## 4. Maintenance commands

- `npm run generate:openapi` — refresh Swagger JSON files.
- `npm run export:schemas` — regenerate shared Zod schemas.
- `npm run lint`, `npm test`, `npm run test:e2e` — apply quality gates.

## 5. Troubleshooting

| Symptom | Suggested action |
|---------|------------------|
| SQL Server connection errors | Confirm `SQLSERVER_*` in `.env` and check container health (`docker compose ps`). |
| `401 Unauthorized` responses | Issue a new token via `/auth/login` and verify Redis is running (`AUTH_SESSION_TTL_SECONDS`). |
| Missing audit documents | Inspect `AuditService` logs; when RabbitMQ is down, the fallback writes straight to MongoDB. |
| Cache not invalidated | Ensure the `repositoryCache` toggle is enabled (`FEATURE_FLAGS`). |
| Theme always light | Set `NEXT_PUBLIC_START_THEME=dark` and clear `localStorage` (`fleetcore.theme-preference`). |

## 6. Useful references

- Swagger docs (EN/PT).
- Project scripts (`package.json`).
- This GitPageDocs knowledge base.

Follow these steps to spin up, validate and troubleshoot the fleet-management platform end to end.
