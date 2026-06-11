# Requisitos e Critérios

Este capítulo mapeia o checklist do desafio para os artefatos de código correspondentes, facilitando a auditoria do que foi entregue.

## Escopo funcional

| Item do desafio | Implementação | Observações |
|-----------------|---------------|-------------|
| CRUD de **marcas** | `backend/src/modules/fleet/interfaces/http/brands.controller.ts`, `brands.service.ts` | Enforce unicidade de nome, publica eventos de domínio e atualiza cache. |
| CRUD de **modelos** | `models.controller.ts`, `models.service.ts` | Relaciona modelos a marcas (opcional), validação centralizada com DTOs/Zod. |
| CRUD de **veículos** | `vehicles.controller.ts`, `vehicles.service.ts` | Consulta com cache Redis (`RepositoryCacheService`) e expõe eventos `vehicle.*`. |
| Consistência veículo-modelo-marca | Agregados em `backend/src/modules/fleet/domain` | Services checam existência de modelo/marca antes de persistir veículo. |
| Seed do usuário `aivacol` | `backend/src/apps/api/app-bootstrap.service.ts`, `UsersService.ensureAdminSeed()` | Cria admin inicial com roles configuráveis. |
| Autenticação JWT/RBAC | `backend/src/modules/auth/interfaces/http/auth.controller.ts` | Endpoints `login`, `register`, `logout`, `me` com sessões no Redis. |
| Trilha de auditoria | `backend/src/modules/audit/interceptors/audit.interceptor.ts`, `audit-writer.service.ts` | Captura requisição/resposta e persiste em MongoDB quando necessário. |
| Mensageria RabbitMQ | `backend/src/modules/messaging/messaging.service.ts`, `FleetDomainEventListener` | Publica eventos no exchange `fleetcore.events` e mantém consumidor de exemplo. |
| Frontend de gestão | `frontend/src/app/dashboard/page.tsx`, `frontend/src/widgets` | Dashboards, formulários e filtros integrados via React Query. |

## Critérios técnicos

| Critério | Evidência |
|----------|-----------|
| Arquitetura limpa / DDD | Módulos isolados (`auth`, `fleet`, `messaging`, `audit`, `users`) e camada `shared` com config, unit of work e resiliência. |
| Persistência SQL Server | Migração `backend/src/migrations/1717845600000-InitSchema.ts`, repositórios TypeORM em `backend/src/modules/fleet/infrastructure`. |
| Cache Redis obrigatório | `backend/src/shared/cache/repository-cache.service.ts` controla o namespace `fleetcore:cache:*`. |
| JWT + RBAC | `JwtStrategy`, `JwtAuthGuard`, `RolesGuard`, sessões via `AuthSessionService`. |
| Sanitização e rate limiting | Configuração em `backend/src/apps/api/security/security-setup.ts` com `SanitizeInputPipe` + `ThrottlerGuard`. |
| Mensageria | `MessagingService` e `vehicle-events.consumer.ts` implementam troca de mensagens resiliente. |
| Auditoria MongoDB | `AuditService` e `AuditWriterService` garantem persistência mesmo com falha de fila. |
| Schemas compartilhados | `npm run export:schemas` exporta validações para `frontend/src/shared/schemas`. |
| Frontend FSD | Redux (`frontend/src/processes/app/store`), React Query (`entities/*/api`), UI em `shared/ui`. |
| Documentação | Swagger builder (`backend/src/apps/api/swagger/swagger.factory.ts`) com dois docs (`/docs` EN e `/docs-pt` PT), tema escuro com identidade Fleetcore, exemplos bilíngues, Try-it-out habilitado e login pré-preenchido; além deste GitPagedocs. |

## Evidências complementares

- Swagger PT/EN acessível em `/docs-pt` e `/docs`, com tema escuro Fleetcore, exemplos bilíngues, Try-it-out e corpo do `POST /auth/login` pré-preenchido com as credenciais seed.
- Suites de testes: backend (`backend/tests`) com unitários, integração (busca/ordenação de veículos) e e2e; frontend (`frontend/tests`) com unit (auth slice, ConfirmDialog, SelectField) e e2e de login.
- Scripts reprodutíveis (`docker-compose.yml`, `npm run export:schemas`, `npm run generate:openapi`). A documentação GitPagedocs é publicada no GitHub Pages pelo workflow `.github/workflows/gitpagedocs-pages.yml`.
- Feature toggles (`FeatureToggleService`) para ativar/desativar cache, eventos, worker de auditoria e Swagger conforme o ambiente.

Todos os itens obrigatórios e bônus do desafio possuem apontamento direto para código e scripts de execução dentro do repositório.
