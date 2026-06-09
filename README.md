# Fleetcore Fleet Management Platform

## 🇧🇷 Descrição em Português
<details>
<summary><strong>Ver Detalhes</strong></summary>

### Visão Geral
- Plataforma de gestão de frota com backend NestJS e frontend Next.js.
- Arquitetura limpa, DDD, cache distribuído, mensageria RabbitMQ e auditoria MongoDB.
- Segurança enterprise (CSP, HSTS, rate limiting, correlação de requisições, CORS com allow-list).

### Stack
- Backend: NestJS 10+, TypeORM (SQL Server), Redis, RabbitMQ, MongoDB, JWT, RBAC.
- Frontend: Next.js 14 (App Router), Feature-Sliced Design, Redux Toolkit, React Query, Axios, Tailwind.
- Infra: Docker Compose com SQL Server, Redis, MongoDB, RabbitMQ, API e Web.

### Execução
**Docker**
```bash
cp .env.example .env
docker compose up --build
```
Serviços: Frontend `http://localhost:${FRONTEND_PORT:-3001}`, Backend `http://localhost:${HTTP_PORT:-3000}/api`, RabbitMQ UI `http://localhost:15672`.

**Manual**
```bash
# Backend
cd backend && npm install && npm run build && npm run start:prod

# Frontend
cd frontend && npm install && npm run dev
```

### Variáveis Principais
Confira `.env.example` para:
- `HTTP_PORT`, `FRONTEND_PORT`
- `SQLSERVER_*`, `REDIS_*`, `MONGO_URI`, `RABBITMQ_*`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `SECURITY_CORS_ALLOWED_ORIGINS`, `SECURITY_RATE_LIMIT_*`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_NAME`

### Testes
- Backend: `npm run lint`, `npm test`, `npm run test:e2e`, `npm run test:cov`, `npm run build`.
- Frontend: `npm run lint`, `npm test`, `npm run test:e2e`, `npm run build`.

### Estrutura
- `backend/` – API NestJS (auth, fleet, messaging, audit, shared).
- `frontend/` – Web Next.js estruturada em FSD.
- `docs/` – referências de arquitetura.
- `docker-compose.yml` – orquestração completa.

### Credenciais Seed
- Usuário: `aivacol`
- Senha: `aivacol123!`

</details>

## 🇺🇸 English Description
<details>
<summary><strong>View Details</strong></summary>

### Overview
- Fleet management platform powered by NestJS backend and Next.js frontend.
- Clean architecture, DDD, distributed cache, RabbitMQ messaging, MongoDB auditing.
- Enterprise-grade security (CSP, HSTS, rate limiting, request correlation, allow-listed CORS).

### Stack
- Backend: NestJS 10+, TypeORM (SQL Server), Redis, RabbitMQ, MongoDB, JWT, RBAC.
- Frontend: Next.js 14 (App Router), Feature-Sliced Design, Redux Toolkit, React Query, Axios, Tailwind.
- Infra: Docker Compose bundling SQL Server, Redis, MongoDB, RabbitMQ, API, and Web app.

### Running
**Docker**
```bash
cp .env.example .env
docker compose up --build
```
Services: Frontend `http://localhost:${FRONTEND_PORT:-3001}`, Backend `http://localhost:${HTTP_PORT:-3000}/api`, RabbitMQ UI `http://localhost:15672`.

**Manual**
```bash
# Backend
cd backend && npm install && npm run build && npm run start:prod

# Frontend
cd frontend && npm install && npm run dev
```

### Key Environment Variables
See `.env.example` for:
- `HTTP_PORT`, `FRONTEND_PORT`
- `SQLSERVER_*`, `REDIS_*`, `MONGO_URI`, `RABBITMQ_*`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `SECURITY_CORS_ALLOWED_ORIGINS`, `SECURITY_RATE_LIMIT_*`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_NAME`

### Tests
- Backend: `npm run lint`, `npm test`, `npm run test:e2e`, `npm run test:cov`, `npm run build`.
- Frontend: `npm run lint`, `npm test`, `npm run test:e2e`, `npm run build`.

### Structure
- `backend/` – NestJS API (auth, fleet, messaging, audit, shared).
- `frontend/` – Next.js Web app following FSD.
- `docs/` – architecture docs.
- `docker-compose.yml` – full stack orchestration.

### Seed Credentials
- User: `aivacol`
- Password: `aivacol123!`

</details>
