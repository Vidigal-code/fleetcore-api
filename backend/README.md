# Fleetcore API

## 🇧🇷 Descrição em Português
<details>
<summary><strong>Ver Detalhes</strong></summary>

### Visão Geral
- API NestJS 10+ estruturada em DDD para o módulo de Gestão de Frota.
- Persistência em SQL Server via TypeORM, cache Redis, eventos RabbitMQ e auditoria MongoDB.
- Segurança enterprise: JWT + RBAC, headers com Helmet (CSP/HSTS), rate limiting, correlação de requisições e CORS com allow-list.

### Tecnologias
- NestJS, TypeORM, SQL Server, Redis, RabbitMQ, MongoDB.
- JWT + Passport, `@nestjs/throttler`, `cache-manager-redis-yet`.
- Testes com Jest (unitários, integração, e2e com Supertest).

### Modelagem e Domínio
- Tabelas obrigatórias (`models`, `vehicles`) com metadados `created_at`, `updated_at`, `created_by`.
- Bônus implementados: `brands`, `users` e seeds (`ensureAdminSeed`).
- `UnitOfWork` garante rollback nas operações de escrita; serviços reutilizam presenters e mappers.

### Execução
```bash
npm install
npm run build
npm run start:prod
# modo dev: npm run start:dev
# worker de auditoria: npm run start:audit-worker
```

### Documentação
- Swagger PT-BR: `http://localhost:3000/docs-pt`
- Swagger EN: `http://localhost:3000/docs`
- Sincronizar cliente TypeScript (API em execução):
  ```bash
  npm run generate:client
  ```

### Variáveis de Ambiente (ver `backend/.env.sample`)
| Variável | Descrição |
| --- | --- |
| `SQLSERVER_HOST/PORT/USER/PASSWORD/DB` | Conexão com SQL Server |
| `REDIS_HOST/PORT/REDIS_TTL_SECONDS` | Cache de veículos (TTL configurável) |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Assinatura e expiração do token |
| `MONGO_URI` | Audit log em MongoDB |
| `RABBITMQ_URI`, `RABBITMQ_EXCHANGE`, `RABBITMQ_QUEUE` | Eventos `vehicle.*` |
| `RABBITMQ_AUDIT_QUEUE` | Fila dedicada para eventos de auditoria |
| `SECURITY_CORS_ALLOWED_ORIGINS` | Lista CSV de origens permitidas |
| `SECURITY_RATE_LIMIT_TTL`, `SECURITY_RATE_LIMIT_MAX` | Janela e limite do rate limiting |
| `ADMIN_*` | Credenciais do usuário administrador seed |

### Segurança e Observabilidade
- Helmet aplica CSP, HSTS, frameguard e `Permissions-Policy`.
- Middleware gera `X-Request-Id` e `X-Correlation-Id` reutilizados pela auditoria.
- CORS bloqueia origens fora da allow-list e registra tentativas rejeitadas.
- Rate limiting global com `@nestjs/throttler`.
- Auditoria persistida em MongoDB com payload e metadados (IP, user-agent, correlação).
- Proxy TLS + gestão de segredos documentados em `docs/security/tls-and-secrets.md`.

### Mensageria e Cache
- `MessagingService` publica `vehicle.*` e `audit.event` no RabbitMQ, com resiliência (retry + circuit breaker).
- `FleetDomainEventListener` unifica publicação de eventos de domínio e incrementa métricas compartilhadas.
- `AuditEventsConsumer` roda no worker (`npm run start:audit-worker`) e persiste auditoria fora do request.
- `RepositoryCacheService` provê cache reutilizável por repositório com invalidação segmentada (`vehicles.search`).

### Estrutura de Pastas
- `apps/api` – bootstrap, guards globais, interceptors.
- `modules/auth`, `modules/users` – autenticação, RBAC, seed.
- `modules/fleet` – agregados, DTOs, services e controllers de brands/models/vehicles.
- `modules/messaging` – configuração RabbitMQ.
- `modules/audit` – serviço com fila assíncrona, interceptor e writer Mongo.
- `shared` – configs, cache, unit-of-work, validação de ambiente.

### Seeds
- `UsersService.ensureAdminSeed()` cria `aivacol / aivacol123!`.
- `seeds/seed_vehicles.json` fornece dados iniciais de veículos.

### Testes
```bash
npm run lint
npm test
npm run test:e2e
npm run test:cov
npm run build
```
Cobertura inclui regras de negócio, rollback, cache e headers de segurança.

</details>

## 🇺🇸 English Description
<details>
<summary><strong>View Details</strong></summary>

### Overview
- NestJS 10+ API built with DDD for the Fleet Management module.
- SQL Server via TypeORM, Redis cache, RabbitMQ events, MongoDB audit log.
- Enterprise security: JWT + RBAC, Helmet (CSP/HSTS), rate limiting, request correlation, allow-listed CORS.

### Technologies
- NestJS, TypeORM, SQL Server, Redis, RabbitMQ, MongoDB.
- JWT/Passport, `@nestjs/throttler`, `cache-manager-redis-yet`.
- Jest tests (unit, integration, e2e with Supertest).

### Data Model and Domain
- Mandatory tables (`models`, `vehicles`) with metadata `created_at`, `updated_at`, `created_by`.
- Bonus tables implemented: `brands`, `users`, including seeds (`ensureAdminSeed`).
- `UnitOfWork` enforces transactional rollback; services rely on reusable presenters/mappers.

### Running
```bash
npm install
npm run build
npm run start:prod
# dev mode: npm run start:dev
# audit worker: npm run start:audit-worker
```

### Documentation
- Swagger (PT-BR): `http://localhost:3000/docs-pt`
- Swagger (EN): `http://localhost:3000/docs`
- Sync TypeScript client (API running):
  ```bash
  npm run generate:client
  ```

### Environment Variables (see `backend/.env.sample`)
| Variable | Purpose |
| --- | --- |
| `SQLSERVER_HOST/PORT/USER/PASSWORD/DB` | SQL Server connection |
| `REDIS_HOST/PORT/REDIS_TTL_SECONDS` | Vehicle cache configuration |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Token signing/expiration |
| `MONGO_URI` | MongoDB audit storage |
| `RABBITMQ_URI`, `RABBITMQ_EXCHANGE`, `RABBITMQ_QUEUE` | `vehicle.*` events |
| `RABBITMQ_AUDIT_QUEUE` | Dedicated audit event queue |
| `SECURITY_CORS_ALLOWED_ORIGINS` | CORS allow-list |
| `SECURITY_RATE_LIMIT_TTL`, `SECURITY_RATE_LIMIT_MAX` | Rate limiting window/limit |
| `ADMIN_*` | Seeded admin credentials |

### Security & Observability
- Helmet enforces CSP, HSTS, frameguard, `Permissions-Policy`.
- Middleware emits `X-Request-Id` and `X-Correlation-Id`, consumed by the audit interceptor.
- CORS deny non allow-listed origins and logs attempts.
- `@nestjs/throttler` provides global rate limiting.
- Audit interceptor writes every authenticated request with payload and metadata into MongoDB.
- TLS proxy & secrets playbook: see `docs/security/tls-and-secrets.md`.

### Messaging & Cache
- `MessagingService` publishes `vehicle.*` + `audit.event` with built-in retry/circuit breaker policies.
- `FleetDomainEventListener` centralizes domain event forwarding and shared metrics increments.
- `AuditEventsConsumer` runs in the worker (`npm run start:audit-worker`) to persist audit logs asynchronously.
- `RepositoryCacheService` delivers reusable repository-level caching with namespace invalidation (`vehicles.search`).

### Folder Layout
- `apps/api` – bootstrap layer and global guards/interceptors.
- `modules/auth`, `modules/users` – authentication, RBAC, seed routines.
- `modules/fleet` – aggregates, DTOs, services, controllers for brands/models/vehicles.
- `modules/messaging` – RabbitMQ configuration.
- `modules/audit` – async audit pipeline service, interceptor, Mongo writer.
- `shared` – configuration, Redis wrapper, unit-of-work, env validation.

### Seeds
- `UsersService.ensureAdminSeed()` provision admin user (`aivacol / aivacol123!`).
- `seeds/seed_vehicles.json` supplies sample vehicle data.

### Test Commands
```bash
npm run lint
npm test
npm run test:e2e
npm run test:cov
npm run build
```
Coverage spans business rules, transactional rollback, Redis cache and security headers.

</details>
