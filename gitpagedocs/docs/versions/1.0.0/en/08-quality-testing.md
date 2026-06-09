# Quality and Testing

Automated quality gates were a core requirement. The solution provides extensive coverage for backend and frontend, plus linting and resilience safeguards.

## Backend (Jest)

- **Unit tests** (`backend/tests/unit`) cover fleet services, auth flows, audit logic, feature toggles and repositories using mocked collaborators.
- **Integration / e2e** (`backend/tests/e2e`) run against SQLite in-memory, validating real HTTP flows for vehicles and security.
- **Commands**:
  - `npm run lint`
  - `npm test`
  - `npm run test:e2e`
  - `npm run test:cov`

## Frontend (Jest + Playwright)

- **Unit tests** (`frontend/tests/unit`) verify Redux reducers and critical hooks.
- **Playwright e2e** (`frontend/tests/e2e`) assert the login page and main shell behaviour.
- **Commands**:
  - `npm run lint`
  - `npm test`
  - `npm run test:e2e`

## Continuous quality

- ESLint (Next.js + TypeScript) enforces consistent patterns across both applications.
- Schema export (`npm run export:schemas`) keeps validation rules in sync between backend and frontend.
- Feature toggles and resilience wrappers prevent flaky behaviour when external services are unstable.

## Observability

- NestJS logging highlights retries, circuit breaker events and audit fallbacks.
- MongoDB + RabbitMQ retain the full audit trail for post-mortem analysis.
- Domain metrics enable easy integration with monitoring stacks.

Result: every delivery runs through linting and automated tests, ticking the “Automated tests” and “Quality” checkboxes from the challenge.
