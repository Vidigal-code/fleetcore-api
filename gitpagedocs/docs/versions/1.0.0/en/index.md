# Aivacol Fleet Management Platform Docs

This documentation suite describes, end-to-end, the solution delivered for Aivacol's backend technical challenge. It links every requirement to the concrete implementation and highlights architectural decisions, trade-offs, and operational guidance.

## Navigation

- [Challenge Overview](./01-introduction.md) — high-level scope, deliverables, and product vision.
- [Requirements and Criteria](./02-requirements.md) — complete checklist from the assignment and how it is satisfied.
- [Backend Architecture](./03-backend-architecture.md) — NestJS modules, DDD layering, resilience and TypeORM usage.
- [Data and Domain Modeling](./04-data-domain-modeling.md) — entities, migrations, and relationships for models, vehicles, brands and users.
- [Security, Audit and Messaging](./05-security-audit-messaging.md) — JWT + RBAC, Redis sessions, RabbitMQ workflows, MongoDB audit trail.
- [Frontend and Experience](./06-frontend.md) — Next.js FSD, React Query, Redux Toolkit, orange theming and responsive UX.
- [Infrastructure and Deployment](./07-infrastructure.md) — Docker Compose stack, environment variables, scripts and docs generation.
- [Quality and Testing](./08-quality-testing.md) — unit/integration/e2e suites, linting and quality metrics.
- [Runbook and Troubleshooting](./09-runbook.md) — step-by-step bootstrapping, useful commands, seed credentials and recovery tips.

## High-level stack

- **Backend:** NestJS 11, TypeORM, SQL Server, Redis, RabbitMQ, MongoDB, Zod.
- **Frontend:** Next.js 14 (App Router), Redux Toolkit, React Query, Axios, Tailwind, Playwright.
- **Infrastructure:** Docker Compose, npm scripts, GitHub Pages powered by GitPageDocs.

Each section dives deep into the topic and references the relevant paths, services, and commands in the repository.

> Version: 1.0.0
