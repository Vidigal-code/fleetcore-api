# Fleetcore Fleet Management Platform

Plataforma full-stack construída para o desafio técnico da Aivacol, composta por um backend NestJS (DDD + SQL Server + Redis + RabbitMQ + MongoDB) e um frontend Next.js (FSD + Redux Toolkit + React Query). O repositório também inclui um site GitPagedocs bilíngue, scripts de automação e stack Docker completa.

## 🇧🇷 Descrição em Português
<details>
<summary><strong>Ver detalhes</strong></summary>

### Visão geral
- APIs NestJS 11 com autenticação JWT/RBAC, cache Redis, auditoria MongoDB e mensageria RabbitMQ.
- Web app Next.js 14 (App Router) usando Feature-Sliced Design, Redux Toolkit e React Query.
- Docker Compose levanta toda a infraestrutura (SQL Server, Redis, RabbitMQ, MongoDB, API e Web).
- Documentação completa em `gitpagedocs/` (PT/EN/ES) — gerar com `npm run gitpagedocs`.

### Estrutura do projeto
```text
backend/    # API NestJS (auth, fleet, users, messaging, audit, shared)
frontend/   # App Next.js em FSD (entities, features, widgets, processes, shared)
gitpagedocs/ # Documentação GitPagedocs 1.0.0 (PT/EN/ES)
.env.example
```

### Como executar
**Docker (recomendado)**
```bash
cp envexample.txt .env
docker compose up --build
```
Serviços: API `http://localhost:${HTTP_PORT:-3000}/api`, Swagger (`/docs`, `/docs-pt`), Frontend `http://localhost:${FRONTEND_PORT:-3001}`, RabbitMQ UI `http://localhost:15672`.

**Execução manual**
```bash
# API
cd backend
npm install
npm run start:dev   # ou npm run start:prod

# Frontend
cd ../frontend
npm install
npm run dev
```

### Scripts úteis
- `npm run generate:openapi` (backend) – atualiza Swagger PT/EN.
- `npm run export:schemas` (backend) – exporta schemas Zod consumidos pelo frontend.
- `npm run gitpagedocs` (raiz) – gera o site estático da documentação.

### Variáveis principais (`.env.example`)
- `SQLSERVER_*`, `REDIS_*`, `MONGO_URI`, `RABBITMQ_URI`
- `JWT_SECRET`, `AUTH_SESSION_TTL_SECONDS`, `FEATURE_FLAGS_*`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_START_THEME`

### Testes
- Backend: `npm run lint`, `npm test`, `npm run test:e2e`, `npm run test:cov`.
- Frontend: `npm run lint`, `npm test`, `npm run test:e2e`.

### Credenciais seed
- Usuário: `aivacol`
- Senha: `aivacol123!`

Para detalhes aprofundados consulte `gitpagedocs/docs/versions/1.0.0/pt`.

</details>

## 🇺🇸 English Description
<details>
<summary><strong>View details</strong></summary>

### Overview
- NestJS 11 API with JWT/RBAC, Redis cache, RabbitMQ messaging and MongoDB audit trail.
- Next.js 14 web client (App Router + FSD) powered by Redux Toolkit and React Query.
- Docker Compose spins up SQL Server, Redis, RabbitMQ, MongoDB, API and web app.
- Comprehensive multilingual docs in `gitpagedocs/` (build using `npm run gitpagedocs`).

### Project layout
```text
backend/    # NestJS API (auth, fleet, users, messaging, audit, shared)
frontend/   # Next.js app (entities, features, widgets, processes, shared)
gitpagedocs/ # GitPagedocs site version 1.0.0 (PT/EN/ES)
.env.example
```

### Getting started
**Docker (recommended)**
```bash
cp envexample.txt .env
```
Services: API `http://localhost:${HTTP_PORT:-3000}/api`, Swagger (`/docs`, `/docs-pt`), frontend `http://localhost:${FRONTEND_PORT:-3001}`, RabbitMQ UI `http://localhost:15672`.

**Manual run**
```bash
# API
cd backend
npm install
npm run start:dev   # or npm run start:prod

# Frontend
cd ../frontend
npm install
npm run dev
```

### Handy scripts
- `npm run generate:openapi` (backend) – rebuild Swagger PT/EN specs.
- `npm run export:schemas` (backend) – sync validation schemas with the frontend.
- `npm run gitpagedocs` (root) – compile the documentation site.

### Key environment variables (`.env.example`)
- `SQLSERVER_*`, `REDIS_*`, `MONGO_URI`, `RABBITMQ_URI`
- `JWT_SECRET`, `AUTH_SESSION_TTL_SECONDS`, `FEATURE_FLAGS_*`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_START_THEME`

### Tests
- Backend: `npm run lint`, `npm test`, `npm run test:e2e`, `npm run test:cov`.
- Frontend: `npm run lint`, `npm test`, `npm run test:e2e`.

### Seed credentials
- User: `aivacol`
- Password: `aivacol123!`

Refer to `gitpagedocs/docs/versions/1.0.0/en` for deeper architectural documentation.

</details>

## 📚 Documentação complementar
- GitPagedocs (PT/EN/ES): `gitpagedocs/docs/versions/1.0.0`
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`

Sinta-se à vontade para abrir issues ou PRs com melhorias. Boa avaliação! 🚀
