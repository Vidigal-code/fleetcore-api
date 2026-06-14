# Aivacol Fleet Management Platform Docs

This documentation suite describes, end-to-end, the solution delivered for Aivacol's backend technical challenge. It links every requirement to the concrete implementation and highlights architectural decisions, trade-offs, and operational guidance.

## Navigation

- **Challenge Overview** — high-level scope, deliverables, and product vision.
- **Requirements and Criteria** — complete checklist from the assignment and how it is satisfied.
- **Backend Architecture** — NestJS modules, DDD layering, resilience and TypeORM usage.
- **Data and Domain Modeling** — entities, migrations, and relationships for models, vehicles, brands and users.
- **Security, Audit and Messaging** — JWT + RBAC, Redis sessions (sliding TTL + lock), distributed lock, idempotency, dedicated rate limiting, enriched RabbitMQ → MongoDB audit trail, retry/fallback/rollback. Additive changes — existing flow preserved.
- **Frontend and Experience** — Next.js 16 / React 19 FSD, React Query, Redux Toolkit (auth only), yellow/amber theming and responsive UX.
- **Infrastructure and Deployment** — Docker Compose stack, environment variables, scripts and docs generation.
- **Quality and Testing** — unit/integration/e2e suites, linting and quality metrics.
- **Runbook and Troubleshooting** — step-by-step bootstrapping, useful commands, seed credentials and recovery tips.

## High-level stack

- **Backend:** NestJS 11, TypeORM, SQL Server, Redis, RabbitMQ, MongoDB, Zod.
- **Frontend:** Next.js 16 (App Router), React 19, Redux Toolkit, React Query, Axios, Tailwind, Playwright.
- **Infrastructure:** Docker Compose, a single root `envexample.txt`, GitHub Pages published via GitHub Actions (GitPageDocs).

Each section dives deep into the topic and references the relevant paths, services, and commands in the repository.

> Version: 1.0.0
