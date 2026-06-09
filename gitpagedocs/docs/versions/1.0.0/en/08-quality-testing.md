# Quality and Testing

Quality gates combine automated tests, linting and resilience utilities so regressions are caught early and integrations can recover gracefully.

## Backend test suites

- **Unit tests** (`backend/tests/unit`) mock repositories/cache to validate services, guards, feature toggles and event listeners.
- **Integration tests** (`backend/tests/integration`) exercise TypeORM repositories and migrations against a disposable SQL Server container.
- **End-to-end tests** (`backend/tests/e2e`) spin up the Nest application with an in-memory database to hit real HTTP endpoints (auth + fleet CRUD).
- **Coverage**: `npm run test:cov` generates Istanbul reports; `npm run lint` enforces coding standards via ESLint (Nest preset).
- **Resilience checks**: tests simulate RabbitMQ outages ensuring `ResilienceService` fallbacks behave as expected.

## Frontend test suites

- **Unit tests** (`frontend/tests/unit`) rely on React Testing Library to verify reducers (auth/theme), hooks and UI components.
- **Playwright** (`frontend/tests/e2e`) covers authentication, dashboard rendering and CRUD flows against the running API.
- **Static analysis**: `npm run lint` (Next.js/TypeScript rules) and `npm run build` act as build-time safety nets.

## Shared quality tooling

- **Schema export**: running `npm run export:schemas` aligns validation logic between backend and frontend before releasing.
- **Pre-commit guidance**: tasks are orchestrated through package scripts; CI pipelines reuse the same commands to stay deterministic.
- **Resilience instrumentation**: logs (structured by Nest) and metrics (`DomainMetricsService`) provide insight during failure simulations.

Thanks to these suites the repository satisfies the assessment’s automated testing requirement while providing clear feedback loops for new changes.
