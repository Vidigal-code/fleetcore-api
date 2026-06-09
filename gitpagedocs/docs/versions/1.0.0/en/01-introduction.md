# Challenge Overview

The Aivacol fleet-management challenge asks for a production-ready platform that spans backend services, a web client, asynchronous integrations and complete documentation. The `fleetcore-api` repository fulfils the brief with:

- **Backend**: NestJS 11, TypeORM (SQL Server), Redis cache, RabbitMQ messaging and MongoDB audit trail.
- **Frontend**: Next.js 14 (App Router) structured with the Feature-Sliced Design pattern, Redux Toolkit and React Query.
- **Infrastructure**: Docker Compose for all dependencies, seed data, npm scripts and environment blueprints.
- **Quality & Ops**: Automated tests, resilience policies, Swagger PT/EN, bilingual GitPageDocs.

## Deliverables at a glance

| Deliverable | Description | Source |
|-------------|-------------|--------|
| REST API | CRUD for brands, models and vehicles, auth/session management, audit worker | `backend/src/modules`, `backend/src/apps` |
| Messaging & audit | RabbitMQ publisher/consumer, MongoDB audit writer, resilience wrappers | `backend/src/modules/messaging`, `backend/src/modules/audit` |
| Web client | FSD layout, authentication shell, fleet dashboards, shared schemas | `frontend/src/app`, `frontend/src/{entities,features,processes,widgets,shared}` |
| Docs & tooling | GitPagedocs site, Swagger builders, schema export scripts | `gitpagedocs/`, `backend/package.json` scripts |
| Infrastructure | Compose stack, runtime envs, seed dataset | `docker-compose.yml`, `.env.example`, `backend/src/apps/api/app-bootstrap.service.ts`, `backend/seeds` |

## Repository structure (excerpt)

```text
backend/
  src/
    apps/
      api/                # HTTP bootstrap, guards, Swagger
      audit-worker/       # Async worker for MongoDB audit fallback
    modules/
      auth/               # JWT, sessions, guards
      fleet/              # Brands, models, vehicles (DDD)
      audit/              # Interceptor + Mongo writer
      messaging/          # RabbitMQ integration
      users/              # Admin seed and user repo
    shared/               # Config, cache, unit of work, resilience, validation
frontend/
  src/
    app/                  # Next.js routes & layout
    entities/, features/, widgets/, processes/, shared/
gitpagedocs/              # This documentation site
```

## Using these docs

The chapters follow the same order as the navigation menu. Each section summarises the capability and points to the concrete files in the repository so reviewers can inspect the implementation quickly.

1. **Challenge Overview** – context, deliverables and repository layout (this page).
2. **Requirements and Criteria** – mapping between the assessment checklist and code.
3. **Backend Architecture** – module boundaries, flows and supporting services.
4. **Data and Domain Modeling** – aggregates, migrations and repository contracts.
5. **Security, Audit and Messaging** – authentication, audit logging and RabbitMQ.
6. **Frontend and Experience** – FSD slices, state management and UI theming.
7. **Infrastructure and Deployment** – Docker images, env vars and scripts.
8. **Quality and Testing** – automated tests, linting and resilience utilities.
9. **Runbook and Troubleshooting** – commands and operational tips.

Navigate via the header menu or the “Next/Previous” buttons to dive deeper into each capability.
