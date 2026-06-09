# Fleetcore API

API NestJS 11 baseada em DDD para o domínio de gestão de frota. Inclui autenticação com sessões em Redis, eventos RabbitMQ, trilha de auditoria em MongoDB e documentação Swagger bilíngue.

## 🇧🇷 Descrição em Português
<details>
<summary><strong>Ver detalhes</strong></summary>

### Arquitetura
- **Módulos**: `auth`, `fleet`, `users`, `messaging`, `audit` e camada `shared` (config, cache, unit of work, resiliência, métricas).
- **Aplicações**: `apps/api` (HTTP) e `apps/audit-worker` (processamento assíncrono de auditoria).
- **DDD**: agregados (`Brand`, `Model`, `Vehicle`, `User`), eventos (`VehicleCreatedEvent`, etc.) e repositórios TypeORM customizados.

### Execução
```bash
npm install
npm run start:dev          # desenvolvimento
npm run start:prod         # produção
npm run start:audit-worker # worker de auditoria (opcional)
```

### Scripts úteis
- `npm run generate:openapi` – atualiza Swagger PT/EN.
- `npm run export:schemas` – exporta schemas Zod para o frontend.
- `npm run lint`, `npm test`, `npm run test:e2e`, `npm run test:cov` – qualidade e cobertura.

### Variáveis de ambiente (ver `backend/.env.sample`)
| Variável | Descrição |
|----------|-----------|
| `SQLSERVER_*` | Conexão com SQL Server |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_TTL_SECONDS` | Cache de repositório/sessões |
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS` | Autenticação JWT/Redis |
| `RABBITMQ_URI`, `RABBITMQ_EXCHANGE`, `RABBITMQ_QUEUE`, `RABBITMQ_AUDIT_QUEUE` | Mensageria de domínio/auditoria |
| `MONGO_URI` | Persistência da trilha de auditoria |
| `FEATURE_FLAGS_*` | Cache, eventos, worker assíncrono, swagger |

### Documentação
- Swagger EN: `http://localhost:3000/docs`
- Swagger PT-BR: `http://localhost:3000/docs-pt`
- GitPagedocs: `../gitpagedocs/docs/versions/1.0.0/pt`

### Estrutura de diretórios
```text
apps/
  api/           # Bootstrap HTTP, guards, interceptors
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
npm test
npm run test:e2e
npm run test:cov
```

</details>

## 🇺🇸 English Description
<details>
<summary><strong>View details</strong></summary>

### Architecture
- **Modules**: `auth`, `fleet`, `users`, `messaging`, `audit`, and a `shared` layer with config, cache, unit of work, resilience and metrics services.
- **Applications**: `apps/api` (HTTP gateway) and `apps/audit-worker` (async audit processor).
- **DDD**: aggregates (`Brand`, `Model`, `Vehicle`, `User`), domain events, TypeORM repositories, Redis cache per repository.

### Running
```bash
npm install
npm run start:dev          # development
npm run start:prod         # production
npm run start:audit-worker # audit worker (optional)
```

### Handy scripts
- `npm run generate:openapi` – rebuild bilingual Swagger docs.
- `npm run export:schemas` – share validation schemas with the frontend.
- Testing: `npm run lint`, `npm test`, `npm run test:e2e`, `npm run test:cov`.

### Environment variables (`backend/.env.sample`)
| Variable | Purpose |
|----------|---------|
| `SQLSERVER_*` | SQL Server connection |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_TTL_SECONDS` | Repository/session cache configuration |
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS` | JWT & Redis session settings |
| `RABBITMQ_URI`, `RABBITMQ_EXCHANGE`, `RABBITMQ_QUEUE`, `RABBITMQ_AUDIT_QUEUE` | Domain + audit messaging |
| `MONGO_URI` | MongoDB audit storage |
| `FEATURE_FLAGS_*` | Toggle cache, domain events, async audit worker, swagger |

### Documentation
- Swagger EN: `http://localhost:3000/docs`
- Swagger PT-BR: `http://localhost:3000/docs-pt`
- GitPagedocs: `../gitpagedocs/docs/versions/1.0.0/en`

### Folder layout
```text
apps/api            # HTTP bootstrap, global guards/interceptors
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
npm test
npm run test:e2e
npm run test:cov
```

</details>
