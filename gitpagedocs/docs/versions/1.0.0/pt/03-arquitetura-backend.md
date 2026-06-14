# Arquitetura Backend

O backend foi construído em **NestJS 11** com foco em modularidade, extraindo regras de domínio para serviços e agregados. O projeto segue a estrutura `apps/`, `modules/` e `shared/`, mantendo responsabilidades claras e facilitando testes isolados.

## Organização por módulos

- `apps/api` — aplicação HTTP principal, registra guards globais (`JwtAuthGuard`, `RolesGuard`, `ThrottlerGuard`, `RateLimitGuard`) e interceptores de auditoria e idempotência.
- `modules/auth` — autenticação, emissão/validação JWT, `AuthSessionService` (Redis) e controladores `login/me/logout/register`.
- `modules/fleet` — contexto de frota com serviços para **brands**, **models** e **vehicles**, eventos de domínio e listeners RabbitMQ.
- `modules/audit` — interceptores, serviço de auditoria e writer MongoDB; o `AuditInterceptor` audita toda rota não-pública com evento enriquecido (`eventId`, `correlationId`, `sessionId`, `route`, `statusCode`, etc.) e o `audit-worker` (`apps/audit-worker`) consome `fleetcore.audit`.
- `modules/messaging` — integração com RabbitMQ via `@golevelup/nestjs-rabbitmq` e consumer de eventos.
- `modules/users` — seed `aivacol`, criação e busca de usuários, repositórios TypeORM.
- `apps/api/security` — guards de borda: `RateLimitGuard`/`RateLimitService` (rate limit Redis dedicado, global) e `IdempotencyInterceptor`.
- `shared` — cross-cutting concerns: cache Redis (`RepositoryCacheService`), lock distribuído (`RedisLockService`), idempotência (`IdempotencyService`), feature toggles, unit of work, métricas, resiliência e configurações.

## Camadas e padrões

1. **Interface (Controllers/DTOs)** — expõem rotas REST com validação (`class-validator` + objetos Zod compartilhados). Exemplos: `vehicles.controller.ts`, `models.controller.ts`.
2. **Aplicação (Services)** — concentra regras de uso do domínio, transações (`UnitOfWork`), disparo de eventos e auditoria. Exemplos: `vehicles.service.ts`, `models.service.ts`.
3. **Domínio (Aggregates/Eventos)** — classes imutáveis (`Vehicle`, `Model`, `Brand`) e eventos (`VehicleCreatedEvent`, etc.) garantem consistência.
4. **Infraestrutura (Repositórios/Adapters)** — repositórios TypeORM (`VehicleTypeOrmRepository`) e integrações (Redis, RabbitMQ, MongoDB).

## Resiliência e observabilidade

- **Resilience Service** (`shared/resilience`): encapsula políticas de retry, circuit breaker e timeout para chamadas externas (RabbitMQ/Audit), além de `executeWithRetry`, `executeWithFallback` (erro controlado → fallback) e `executeWithRollback` (compensações na ordem inversa). O rollback transacional do banco permanece no `UnitOfWork`.
- **Proteções Redis** (`shared/cache`): `RepositoryCacheService` (cache de leitura), `RedisLockService` (lock distribuído `SET NX EX` + Lua compare-and-del/pexpire) e `IdempotencyService` (header `Idempotency-Key`, 409 em duplicidade) protegem o banco em operações críticas.
- **Feature toggles** (`shared/features`): permitem habilitar/desabilitar cache, eventos e processamento assíncrono via env (`FEATURE_FLAGS`).
- **Domain Metrics** (`shared/metrics`): incrementa contadores por evento publicado.

## Fluxo de requisição

1. Requisição HTTP passa pelo `SanitizeInputPipe`, pelo `RateLimitGuard` (Redis) e pelos guards (JWT + Roles + Throttler). A `JwtStrategy` valida a sessão Redis, renova seu TTL (sliding) e recusa sessões bloqueadas (401). Mutações com `Idempotency-Key` passam pelo `IdempotencyInterceptor` (409 em duplicidade).
2. Controlador injeta serviço que aplica validações de negócio, utilizando `UnitOfWork` para commits transacionais (e `RedisLockService` para serializar operações concorrentes quando necessário).
3. Após persistência, o serviço registra auditoria, invalida cache Redis e publica eventos de domínio.
4. `FleetDomainEventListener` trata os eventos e encaminha payloads para RabbitMQ (mensageria) quando o toggle estiver ativo.

## Configuração centralizada

Config files em `shared/config` garantem tipagem e fallback padrão:

- `app.config.ts`, `database.config.ts`, `redis.config.ts`, `jwt.config.ts`, `audit.config.ts`, `messaging.config.ts`, `swagger.config.ts`, `auth.config.ts`.
- `AppConfigService` resolve valores com validação (`env.validation.ts`) e fornece acesso sem espalhar chamadas ao `ConfigService`.

## Porque essa arquitetura atende o desafio

- Permite **escala horizontal** (stateless + cache Redis + RabbitMQ).
- Mantém **isolamento de domínios** (módulo `fleet` não conhece detalhes de auth, auditoria ou mensageria).
- Facilita **testes unitários** (serviços recebem repositórios/colaboradores via DI) e **integrações** (e2e usa SQLite em memória).
- Deixa o código pronto para **novos contextos** (ex.: manutenção de motoristas) apenas adicionando módulos.
