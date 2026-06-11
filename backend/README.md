# Fleetcore API

API NestJS 11 baseada em DDD para o domínio de gestão de frota. Inclui autenticação com sessões em Redis, eventos RabbitMQ, trilha de auditoria em MongoDB e documentação Swagger bilíngue com tema escuro e exemplos prontos.

## 🇧🇷 Descrição em Português
<details>
<summary><strong>Ver detalhes</strong></summary>

### Arquitetura
- **Módulos**: `auth`, `fleet`, `users`, `messaging`, `audit` e camada `shared` (config, cache, unit of work, resiliência, métricas, feature toggles, validação).
- **Aplicações**: `apps/api` (HTTP) e `apps/audit-worker` (processamento assíncrono de auditoria).
- **DDD**: agregados (`Brand`, `Model`, `Vehicle`, `User`), eventos de domínio (`VehicleCreatedEvent`, etc.) e repositórios TypeORM customizados.
- **Transações/rollback**: `UnitOfWork` envolve as operações de escrita em transações TypeORM.
- **Resiliência**: políticas de retry + circuit breaker (cockatiel) na publicação de mensagens.

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
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS` | Autenticação JWT/Redis |
| `RABBITMQ_URI`, `RABBITMQ_EXCHANGE`, `RABBITMQ_QUEUE`, `RABBITMQ_AUDIT_QUEUE` | Mensageria de domínio/auditoria |
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
- **Transactions/rollback**: `UnitOfWork` wraps write operations in TypeORM transactions.
- **Resilience**: retry + circuit breaker policies (cockatiel) around message publishing.

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
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS` | JWT & Redis session settings |
| `RABBITMQ_URI`, `RABBITMQ_EXCHANGE`, `RABBITMQ_QUEUE`, `RABBITMQ_AUDIT_QUEUE` | Domain + audit messaging |
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
