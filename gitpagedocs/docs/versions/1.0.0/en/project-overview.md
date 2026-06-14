# Project Overview

This page provides a quick tour of the fleet-management solution before diving into the detailed chapters.

## Mission

Deliver a production-ready stack that satisfies every requirement from the Aivacol challenge across backend, frontend, infrastructure and documentation.

## Pillars

- **Architecture** — modules, layers and entities covered in the Backend Architecture and Data and Domain Modeling sections.
- **Security & observability** — RBAC, Redis sessions (sliding TTL + lock), distributed lock, idempotency, a dedicated rate-limit guard, enriched audit logs and RabbitMQ flows summarized in the Security, Audit and Messaging chapter. These are additive: the existing structure and flow were preserved.
- **User experience** — FSD structure, theming and data flow documented under Frontend and Experience.
- **Quality & operations** — QA and support routines detailed in the Quality and Testing and Runbook sections.

## Outcomes

- NestJS APIs with DDD, Redis cache and RabbitMQ events.
- Responsive Next.js client sharing Zod schemas with the backend.
- Docker Compose stack bundling SQL Server, Redis, RabbitMQ and MongoDB.
- Bilingual GitPageDocs site aligned with the assessment.

Use the navigation menu to open the sections most relevant to your review.
