# Requisitos e Critérios

Esta seção relaciona cada item do enunciado ao respectivo artefato no repositório, permitindo auditoria rápida de conformidade.

## Requisitos funcionais

| Item do desafio | Implementação | Observações |
|-----------------|---------------|-------------|
| CRUD de **models** | `backend/src/modules/fleet/interfaces/http/models.controller.ts` + `models.service.ts` | Validação com DTOs/Zod; ligação opcional a brands. |
| CRUD de **vehicles** | `vehicles.controller.ts` + `vehicles.service.ts` | Cache Redis em `RepositoryCacheService`, invalidação automática e eventos de domínio. |
| CRUD de **brands** (bônus) | `brands.controller.ts` + `brands.service.ts` | Disponível via RabbitMQ/Auditoria; integra com models e vehicles. |
| Relacionamento veículo ↔ modelo ↔ marca | Agregados em `backend/src/modules/fleet/domain/*` | Regras no serviço garantem existência de modelo/marca antes de criar veículo. |
| Seed de usuário `aivacol` | `backend/src/apps/api/app-bootstrap.service.ts` + `UsersService.ensureAdminSeed()` | Roles padrão `admin` com senha forte configurável por env. |

## Requisitos técnicos

- **Arquitetura limpa / DDD**: módulos isolados (`auth`, `fleet`, `audit`, `messaging`, `users`, `shared`), uso de agregados, repositórios e `UnitOfWork` (`backend/src/shared/unit-of-work`).
- **Segurança robusta**: guards JWT + `RolesGuard`, sessões no Redis (`AuthSessionService`), interceptor de auditoria, sanitização de entrada (`SanitizeInputPipe`).
- **Padronização da modelagem**: migrations TypeORM (`backend/src/migrations/1717845600000-InitSchema.ts`) seguindo SQL Server, campos `created_at/updated_at/created_by` em todas as tabelas.
- **Redis cache obrigatório**: `RepositoryCacheService` e namespace `vehicles.search` com TTL configurável (`REDIS_TTL_SECONDS`).
- **Mensageria RabbitMQ (bônus)**: módulo dedicado (`backend/src/modules/messaging`), eventos de domínio encaminhados por `FleetDomainEventListener`.
- **Auditoria em MongoDB (bônus)**: `AuditService` publica em fila e persiste fallback via `AuditWriterService` em `audit_event` (Mongoose schema).
- **Docker Compose completo**: `docker-compose.yml` sobe SQL Server, Redis, RabbitMQ, MongoDB, API e frontend.

## Critérios de avaliação atendidos

- **Clareza e organização**: código estruturado, nomes consistentes e documentação (README + gitpagedocs).
- **Eficiência e redundância controlada**: uso de constantes compartilhadas (`backend/src/modules/fleet/fleet.constants.ts`, `frontend/src/shared/schemas`), eliminação de strings mágicas.
- **Uso correto do TypeORM**: entidades em `backend/src/modules/fleet/infrastructure/entities`, repositórios customizados, migração única.
- **Boas práticas REST**: controllers declaram `@ApiTags`, `@ApiOperation`, retornam DTOs consistentes e usam `NotFoundException`, `ConflictException`, etc.
- **Testes**: suites unitárias/integradas/e2e (`backend/tests`) e Playwright/React Testing Library no frontend (`frontend/tests`).
- **Tratamento de erros**: Resiliência configurada (`backend/src/shared/resilience`), fallback de auditoria, interceptores e logs estruturados.

## Evidências adicionais

- **Documentação Swagger bilíngue** (`/docs` e `/docs-pt`) via `backend/src/apps/api/swagger` + script `npm run generate:openapi`.
- **Ambiente `.env` unificado** com variáveis compartilhadas entre API e web examplificadas em `.env.example`.
- **GitHub Pages** com este guia (`gitpagedocs/`), garantindo rastreabilidade para avaliadores.
