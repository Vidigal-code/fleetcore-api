# Fleetcore API

API NestJS 11 baseada em DDD para o domínio de gestão de frota. Inclui autenticação com sessões em Redis, eventos RabbitMQ, trilha de auditoria em MongoDB e documentação Swagger bilíngue com tema escuro e exemplos prontos.

## 🇧🇷 Descrição em Português
<details>
<summary><strong>Ver detalhes</strong></summary>

### Arquitetura
- **Módulos**: `auth`, `fleet`, `users`, `messaging`, `audit` e camada `shared` (config, cache, unit of work, resiliência, métricas, feature toggles, validação).
- **Aplicações**: `apps/api` (HTTP) e `apps/audit-worker` (processamento assíncrono de auditoria).
- **DDD**: agregados (`Brand`, `Model`, `Vehicle`, `User`), eventos de domínio (`VehicleCreatedEvent`, etc.) e repositórios TypeORM customizados.
- **Transações/rollback**: `UnitOfWork` envolve as operações de escrita em transações TypeORM. `ResilienceService` adiciona `executeWithRetry`, `executeWithFallback` e `executeWithRollback` (compensações em ordem inversa) reutilizáveis.
- **Resiliência**: políticas de retry + circuit breaker (cockatiel) na publicação de mensagens e na persistência da auditoria.
- **Sessões Redis**: `AuthSessionService` cria, valida, renova (TTL deslizante via `refresh`), bloqueia/desbloqueia (`lock`/`unlock`/`isLocked`) e revoga sessões. `JwtStrategy` renova o TTL a cada requisição válida e recusa sessões bloqueadas.
- **Proteção do banco com Redis**: cache de leitura (`RepositoryCacheService`), lock distribuído (`RedisLockService` com Lua compare-and-del/expire), idempotência (`IdempotencyService` + `IdempotencyInterceptor` via header `Idempotency-Key`) e rate limit.
- **Rate limit dedicado**: `RateLimitGuard` (Redis) por usuário/IP/endpoint — padrão 100/60s e `POST /auth/login` 10/60s (`@AuthRateLimit()`), resposta `429 { success, message, retryAfter }`; tentativas bloqueadas são auditadas.
- **Auditoria de todo o app**: `AuditInterceptor` publica em `audit.event`; o evento traz `eventId`, `eventType`, `correlationId`, `requestId`, `userId`, `sessionId`, `method`, `route`, `statusCode`, `success`. O worker grava em MongoDB (`audit_events`) com `status`, `retries`, `sourceQueue` e `processedAt`. Concurrency via `WORKER_CONCURRENCY` (padrão 2 → prefetch RabbitMQ).

### Execução
```bash
npm install
npm run start:dev          # desenvolvimento
npm run start:prod         # produção
npm run start:audit-worker # worker de auditoria (opcional)
```

### Scripts úteis
- `npm run generate:openapi` – gera as specs Swagger PT/EN.
- `npm run export:schemas` – exporta schemas Zod para o frontend.
- `npm run lint`, `npm test`, `npm run test:e2e`, `npm run test:cov` – qualidade e cobertura.

### Variáveis de ambiente (`envexample.txt` na raiz)
| Variável | Descrição |
|----------|-----------|
| `SQLSERVER_*` | Conexão com SQL Server |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_TTL_SECONDS` | Cache de repositório/sessões |
| `REDIS_LOCK_TTL` | TTL (s) dos locks distribuídos / lock de sessão (padrão 30) |
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS` | Autenticação JWT/Redis |
| `RABBITMQ_URI`, `RABBITMQ_EXCHANGE`, `RABBITMQ_QUEUE`, `RABBITMQ_AUDIT_QUEUE` | Mensageria de domínio/auditoria |
| `RABBITMQ_RETRY_QUEUE`, `RABBITMQ_DLQ` | Filas de retry e dead-letter |
| `WORKER_CONCURRENCY` | Concurrency/prefetch dos workers RabbitMQ (padrão 2) |
| `RATE_LIMIT_ENABLED`, `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_MAX_REQUESTS` | Rate limit Redis (geral) |
| `RATE_LIMIT_AUTH_MAX_REQUESTS`, `RATE_LIMIT_AUTH_WINDOW_SECONDS` | Rate limit Redis (login/auth) |
| `RETRY_MAX_ATTEMPTS`, `RETRY_INITIAL_DELAY` | Política de retry reutilizável |
| `MONGO_URI` | Persistência da trilha de auditoria |
| `ADMIN_NICKNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Usuário administrador seed |

### Documentação Swagger
- Swagger EN: `http://localhost:3000/docs`
- Swagger PT-BR: `http://localhost:3000/docs-pt`
- Tema escuro alinhado à identidade Fleetcore, "Try it out" habilitado e corpo do `POST /auth/login` já preenchido com o usuário seed.
- Cada DTO traz descrições bilíngues (PT/EN) e exemplos; os sumários das operações também são bilíngues.
- GitPageDocs: `../gitpagedocs/docs/versions/1.0.0/pt`

### Estrutura de diretórios
```text
apps/
  api/           # Bootstrap HTTP, guards, interceptors, setup do Swagger
  audit-worker/  # Worker para persistir auditoria
modules/
  auth/          # JWT, sessões Redis, guards/decorators
  fleet/         # Domínio da frota (services, DTOs, agregados, eventos)
  messaging/     # Integração RabbitMQ
  audit/         # Interceptor e writer MongoDB
  users/         # Seed e operações com usuários
shared/          # Configs, cache, unit-of-work, resiliência, métricas, validação
```

### Seeds
- Usuário administrador: `aivacol / aivacol123!` via `UsersService.ensureAdminSeed()`.
- Dataset opcional: `seeds/seed_vehicles.json`.

### Testes
```bash
npm run lint
npm test          # unitários (services, auth, audit, shared)
npm run test:e2e  # integração/e2e (inclui busca e ordenação de veículos)
npm run test:cov
```

</details>

## 🇺🇸 English Description
<details>
<summary><strong>View details</strong></summary>

### Architecture
- **Modules**: `auth`, `fleet`, `users`, `messaging`, `audit`, and a `shared` layer with config, cache, unit of work, resilience, metrics, feature toggles and validation.
- **Applications**: `apps/api` (HTTP gateway) and `apps/audit-worker` (async audit processor).
- **DDD**: aggregates (`Brand`, `Model`, `Vehicle`, `User`), domain events and custom TypeORM repositories.
- **Transactions/rollback**: `UnitOfWork` wraps write operations in TypeORM transactions. `ResilienceService` adds reusable `executeWithRetry`, `executeWithFallback` and `executeWithRollback` (reverse-order compensations).
- **Resilience**: retry + circuit breaker policies (cockatiel) around message publishing and audit persistence.
- **Redis sessions**: `AuthSessionService` creates, validates, refreshes (sliding TTL via `refresh`), locks/unlocks (`lock`/`unlock`/`isLocked`) and revokes sessions. `JwtStrategy` refreshes the TTL on each valid request and rejects locked sessions.
- **Database protection with Redis**: read cache (`RepositoryCacheService`), distributed lock (`RedisLockService` with Lua compare-and-del/expire), idempotency (`IdempotencyService` + `IdempotencyInterceptor` via the `Idempotency-Key` header) and rate limiting.
- **Dedicated rate limit**: `RateLimitGuard` (Redis) per user/IP/endpoint — default 100/60s and `POST /auth/login` 10/60s (`@AuthRateLimit()`), `429 { success, message, retryAfter }` response; blocked attempts are audited.
- **App-wide auditing**: `AuditInterceptor` publishes to `audit.event`; the event carries `eventId`, `eventType`, `correlationId`, `requestId`, `userId`, `sessionId`, `method`, `route`, `statusCode`, `success`. The worker persists to MongoDB (`audit_events`) with `status`, `retries`, `sourceQueue` and `processedAt`. Concurrency via `WORKER_CONCURRENCY` (default 2 → RabbitMQ prefetch).

### Running
```bash
npm install
npm run start:dev          # development
npm run start:prod         # production
npm run start:audit-worker # audit worker (optional)
```

### Handy scripts
- `npm run generate:openapi` – rebuild bilingual Swagger specs.
- `npm run export:schemas` – share validation schemas with the frontend.
- Testing: `npm run lint`, `npm test`, `npm run test:e2e`, `npm run test:cov`.

### Environment variables (`envexample.txt` at the repo root)
| Variable | Purpose |
|----------|---------|
| `SQLSERVER_*` | SQL Server connection |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_TTL_SECONDS` | Repository/session cache configuration |
| `REDIS_LOCK_TTL` | TTL (s) for distributed locks / session lock (default 30) |
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS` | JWT & Redis session settings |
| `RABBITMQ_URI`, `RABBITMQ_EXCHANGE`, `RABBITMQ_QUEUE`, `RABBITMQ_AUDIT_QUEUE` | Domain + audit messaging |
| `RABBITMQ_RETRY_QUEUE`, `RABBITMQ_DLQ` | Retry and dead-letter queues |
| `WORKER_CONCURRENCY` | RabbitMQ worker concurrency/prefetch (default 2) |
| `RATE_LIMIT_ENABLED`, `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_MAX_REQUESTS` | Redis rate limit (general) |
| `RATE_LIMIT_AUTH_MAX_REQUESTS`, `RATE_LIMIT_AUTH_WINDOW_SECONDS` | Redis rate limit (login/auth) |
| `RETRY_MAX_ATTEMPTS`, `RETRY_INITIAL_DELAY` | Reusable retry policy |
| `MONGO_URI` | MongoDB audit storage |
| `ADMIN_NICKNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Seeded admin user |

### Documentation
- Swagger EN: `http://localhost:3000/docs`
- Swagger PT-BR: `http://localhost:3000/docs-pt`
- Dark theme matching the Fleetcore identity, "Try it out" enabled and the `POST /auth/login` body pre-filled with the seeded user.
- Every DTO ships bilingual (PT/EN) descriptions and examples; operation summaries are bilingual too.
- GitPageDocs: `../gitpagedocs/docs/versions/1.0.0/en`

### Folder layout
```text
apps/api            # HTTP bootstrap, global guards/interceptors, Swagger setup
apps/audit-worker   # Async worker (audit fallback)
modules/auth        # JWT, Redis sessions, guards/decorators
modules/fleet       # Brands/Models/Vehicles domain (services, DTOs, aggregates)
modules/messaging   # RabbitMQ integration
modules/audit       # Audit interceptor, service, Mongo writer
modules/users       # Admin seed, user repository
shared              # Config, cache, unit-of-work, resilience, metrics, validation
```

### Seeds
- Admin user `aivacol / aivacol123!` created by `UsersService.ensureAdminSeed()`.
- Optional dataset `seeds/seed_vehicles.json` for local development.

### Tests
```bash
npm run lint
npm test          # unit (services, auth, audit, shared)
npm run test:e2e  # integration/e2e (includes vehicle search & ordering)
npm run test:cov
```

</details>
