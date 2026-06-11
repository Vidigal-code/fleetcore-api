# Fleetcore Fleet Management Platform

Plataforma full-stack construída para o desafio técnico da Aivacol: um backend NestJS 11 (DDD + SQL Server + Redis + RabbitMQ + MongoDB) e um frontend Next.js 16 (Feature-Sliced Design + Redux Toolkit + React Query). O repositório inclui um site GitPageDocs trilíngue (PT/EN/ES), scripts de automação e stack Docker completa.

## 🇧🇷 Descrição em Português
<details>
<summary><strong>Ver detalhes</strong></summary>

### Visão geral
- API NestJS 11 com autenticação JWT/RBAC, sessões em Redis, cache Redis por repositório, auditoria em MongoDB e mensageria RabbitMQ.
- Web app Next.js 16 (App Router) em Feature-Sliced Design, com Redux Toolkit (estado de autenticação) e React Query (dados da frota).
- Swagger bilíngue com tema escuro, exemplos prontos e "Try it out" pré-preenchido (`/docs`, `/docs-pt`).
- Docker Compose sobe toda a infraestrutura (SQL Server, Redis, RabbitMQ, MongoDB, API e Web).
- Documentação trilíngue em `gitpagedocs/` (PT/EN/ES), publicada no GitHub Pages.

### Estrutura do projeto
```text
backend/     # API NestJS (auth, fleet, users, messaging, audit, shared)
frontend/    # App Next.js em FSD (app, processes, entities, features, widgets, shared)
gitpagedocs/ # Documentação GitPageDocs 1.0.0 (PT/EN/ES)
docker/      # init.sql do SQL Server e assets de container
scripts/     # Utilitários (ex.: correção de offload de NIC no WSL2)
docker-compose.yml
envexample.txt
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
- `npm run generate:openapi` (backend) – gera as specs Swagger PT/EN.
- `npm run export:schemas` (backend) – exporta schemas Zod consumidos pelo frontend.
- A documentação GitPageDocs é publicada automaticamente no GitHub Pages pelo workflow `.github/workflows/gitpagedocs-pages.yml`.

### Variáveis principais (`envexample.txt`)
- `SQLSERVER_*`, `REDIS_*`, `MONGO_URI`, `RABBITMQ_*`
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS`
- `ADMIN_NICKNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_START_THEME`, `NEXT_PUBLIC_APP_NAME`

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
- NestJS 11 API with JWT/RBAC, Redis sessions, per-repository Redis cache, MongoDB audit trail and RabbitMQ messaging.
- Next.js 16 web client (App Router + FSD) powered by Redux Toolkit (auth state) and React Query (fleet data).
- Bilingual Swagger with a dark theme, ready-to-run examples and pre-filled "Try it out" (`/docs`, `/docs-pt`).
- Docker Compose spins up SQL Server, Redis, RabbitMQ, MongoDB, API and web app.
- Trilingual docs in `gitpagedocs/` (PT/EN/ES), published to GitHub Pages.

### Project layout
```text
backend/     # NestJS API (auth, fleet, users, messaging, audit, shared)
frontend/    # Next.js app in FSD (app, processes, entities, features, widgets, shared)
gitpagedocs/ # GitPageDocs site version 1.0.0 (PT/EN/ES)
docker/      # SQL Server init.sql and container assets
scripts/     # Utilities (e.g. WSL2 NIC offload fix)
docker-compose.yml
envexample.txt
```

### Getting started
**Docker (recommended)**
```bash
cp envexample.txt .env
docker compose up --build
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
- The GitPageDocs site is published to GitHub Pages automatically by `.github/workflows/gitpagedocs-pages.yml`.

### Key environment variables (`envexample.txt`)
- `SQLSERVER_*`, `REDIS_*`, `MONGO_URI`, `RABBITMQ_*`
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS`
- `ADMIN_NICKNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_START_THEME`, `NEXT_PUBLIC_APP_NAME`

### Tests
- Backend: `npm run lint`, `npm test`, `npm run test:e2e`, `npm run test:cov`.
- Frontend: `npm run lint`, `npm test`, `npm run test:e2e`.

### Seed credentials
- User: `aivacol`
- Password: `aivacol123!`

Refer to `gitpagedocs/docs/versions/1.0.0/en` for deeper architectural documentation.

</details>

## 📚 Documentação complementar
- GitPageDocs (PT/EN/ES): `gitpagedocs/docs/versions/1.0.0` · publicado em https://vidigal-code.github.io/fleetcore-api/
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`

Sinta-se à vontade para abrir issues ou PRs com melhorias. Boa avaliação! 🚀
