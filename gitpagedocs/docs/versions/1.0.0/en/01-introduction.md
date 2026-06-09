# Challenge Overview

The **Aivacol** technical assessment requests a full fleet-management platform. The `fleetcore-api` repository delivers a NestJS backend, a Next.js frontend, Docker-based infrastructure and operational documentation, evidencing clean architecture, enterprise-grade practices and service orchestration.

## Goals at a glance

- Provide trustworthy REST APIs to create, read, update and delete **models**, **vehicles** and **brands**.
- Guarantee **enterprise security** (JWT, RBAC, auditing, MongoDB trail and RabbitMQ messaging).
- Offer a responsive **frontend** built with the FSD pattern, Redux Toolkit, React Query, Axios and configurable themes.
- Package everything with **Docker Compose**, automation scripts, Jest/Playwright tests and bilingual documentation.

## Main building blocks

| Pillar | Description | Key folders/files |
|--------|-------------|-------------------|
| Backend API | NestJS 11 + TypeORM (SQL Server), DDD, Unit of Work, domain events, Redis cache | `backend/src/modules`, `backend/src/shared`, `backend/src/migrations` |
| Messaging & Audit | RabbitMQ for fleet events, MongoDB for the audit trail | `backend/src/modules/messaging`, `backend/src/modules/audit` |
| Security | JWT with RBAC, Redis-backed sessions, audit interceptor, input sanitization | `backend/src/modules/auth`, `backend/src/apps/api/security` |
| Frontend | Next.js 14 (App Router), FSD, Redux Toolkit, React Query, dual orange themes | `frontend/src/app`, `frontend/src/{entities,features,processes,shared,widgets}` |
| Infrastructure | Docker Compose (SQL Server, Redis, RabbitMQ, Mongo, API, frontend), npm scripts | `docker-compose.yml`, `.env.example`, `backend/.env.sample`, `frontend/.env.sample` |
| Quality | Unit/integration/e2e tests, linting, GitHub Pages documentation | `backend/tests`, `frontend/tests`, `gitpagedocs/` |

## Documentation structure

This wiki is split into nine chapters that cover the whole challenge:

1. **Challenge Overview** – big picture, components and objectives (this page).
2. **Requirements and Criteria** – the full checklist with direct links to the implementation.
3. **Backend Architecture** – modules, patterns, data flow and resilience.
4. **Data and Domain Modeling** – entities, migrations and aggregates.
5. **Security, Audit and Messaging** – protection mechanisms and observability.
6. **Frontend and Experience** – FSD structure, client data flow and responsive orange UI.
7. **Infrastructure and Deployment** – Docker, environment variables, scripts and docs.
8. **Quality and Testing** – unit/integration/e2e suites, linting and quality gates.
9. **Runbook and Troubleshooting** – how to run the project and handle failures.

Use the “Next/Previous” navigation or the side index to jump to the topic you need.
