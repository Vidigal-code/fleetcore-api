# Segurança, Auditoria e Mensageria

Autenticação, rastreabilidade e integrações assíncronas caminham juntas para manter a plataforma segura e observável.

## Autenticação e autorização

- **Endpoints**: `POST /auth/login`, `POST /auth/register`, `POST /auth/logout` e `GET /auth/me` definidos em `backend/src/modules/auth/interfaces/http/auth.controller.ts`.
- **Estratégia JWT**: `JwtStrategy` valida o token e confirma se o `sessionId` ainda está ativo no Redis antes de liberar o acesso. A cada requisição válida ela **renova o TTL** da sessão (sliding) e **recusa sessões bloqueadas** retornando `401`.
- **Guards e decorators**: `JwtAuthGuard`, `RolesGuard`, `@Roles()` e `@Public()` controlam acesso. `SanitizeInputPipe` + `ThrottlerGuard` (configuração em `backend/src/apps/api/security/security-setup.ts`) evitam ataques simples.

### Sessões no Redis (TTL deslizante + lock)

`AuthSessionService` (`backend/src/modules/auth/application/auth-session.service.ts`) é a fonte de verdade da sessão ativa, que vive **somente no Redis** — o MongoDB guarda apenas a auditoria correspondente. A API expõe:

- `store` / `revoke` / `isActive` — criar, revogar e verificar a sessão.
- `refresh()` — renova o TTL a cada requisição válida (comportamento **sliding**); logout ou redefinição de senha removem a sessão imediatamente.
- `lock()` / `unlock()` / `isLocked()` — bloqueio administrativo da sessão; uma sessão bloqueada é recusada pela `JwtStrategy` com `401`.

Chaves Redis: `auth.sessions:{sessionId}` (dados da sessão) e `auth.sessions.lock:{sessionId}` (flag de bloqueio). O TTL é configurado por `AUTH_SESSION_TTL_SECONDS`.

### Lock distribuído

`RedisLockService` (`backend/src/shared/cache/redis-lock.service.ts`) oferece exclusão mútua entre instâncias:

- `acquireLock` — `SET NX EX`, garantindo um único dono.
- `releaseLock` — script Lua *compare-and-del* que valida o token do dono antes de liberar, evitando *unlock* alheio.
- `renewLock` — script Lua *compare-and-pexpire* para estender o lock do próprio dono.
- `withLock` — helper que adquire, executa e libera o lock automaticamente.

O TTL padrão (`REDIS_LOCK_TTL`, 30s) previne deadlock caso o dono falhe sem liberar.

### Proteção do banco com Redis

Operações críticas passam por uma camada de proteções apoiadas no Redis:

- **Cache de leitura** — `RepositoryCacheService.fetch` / `invalidate` reduz a carga de consulta no banco.
- **Idempotência** — `IdempotencyService` (`markIdempotencyKey` / `isDuplicate`) com o `IdempotencyInterceptor`, que lê o header `Idempotency-Key` em mutações e responde `409` em caso de duplicidade.
- **Lock distribuído** — via `RedisLockService` para serializar operações concorrentes.
- **Rate limit** — guard Redis dedicado (ver abaixo).

### Rate limiting (guard Redis dedicado)

Além do `@nestjs/throttler` (mantido como base), há um guard Redis dedicado: `RateLimitService` + `RateLimitGuard` (global, em `backend/src/apps/api/security/`).

- Contadores por usuário/IP/endpoint: `ratelimit:user:{id}`, `ratelimit:ip:{ip}`, `ratelimit:endpoint:{rota}`.
- Padrão: **100 requisições / 60s**; `POST /auth/login` usa **10 / 60s** via decorator `@AuthRateLimit()`.
- Ao estourar o limite, retorna `429` com JSON `{ "success": false, "message": "Rate limit exceeded", "retryAfter": <s> }`.
- Tentativas bloqueadas são **auditadas** com `eventType` `rate_limit.blocked`.
- Env: `RATE_LIMIT_ENABLED`, `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_AUTH_MAX_REQUESTS`, `RATE_LIMIT_AUTH_WINDOW_SECONDS`.

## Auditoria

- `AuditInterceptor` audita **toda rota não-pública**, registra request/response, identifica o ator autenticado e gera `correlationId`, publicando o evento em `audit.event` (exchange `fleetcore.events`, fila `fleetcore.audit`, routing key `audit.event`).
- O evento agora carrega: `eventId`, `eventType`, `correlationId`, `requestId`, `userId`, `sessionId`, `method`, `route`, `statusCode`, `success` (além de `action`, `entity`, `entityId`, `actor`, `payload`, `metadata`, `occurredAt`).
- O schema Mongo `audit_events` incorpora esses campos e ainda registra metadados de processamento gravados pelo worker: `status='processed'`, `retries`, `sourceQueue`, `processedAt`.
- A persistência usa o `ResilienceService` (retry/fallback); se RabbitMQ estiver indisponível, o caminho de fallback grava diretamente em MongoDB.
- O worker dedicado (`backend/src/apps/audit-worker`) consome `fleetcore.audit` e grava no MongoDB.

## Mensageria RabbitMQ

- Eventos de domínio (`VehicleCreatedEvent`, `VehicleUpdatedEvent`, etc.) são emitidos pelos agregados da frota.
- `FleetDomainEventListener` encaminha os eventos para o `MessagingService`, que publica no exchange `fleetcore.events` (routing keys `vehicle.*`, `brand.*`, `model.*`).
- `VehicleEventsConsumer` mostra como consumir e processar mensagens, servindo de base para integrações futuras.
- `ResilienceService` aplica retries, timeout e circuit breaker nas operações com RabbitMQ para evitar falhas em cascata. Além disso oferece `executeWithRetry`, `executeWithFallback` (erro controlado → caminho alternativo) e `executeWithRollback` (executa etapas e, em falha, roda as compensações na ordem inversa). O `UnitOfWork` continua responsável pelo rollback transacional no banco.
- O `WORKER_CONCURRENCY` (padrão 2) define o `prefetchCount` do RabbitMQ consumido pelo `audit-worker`, que loga a concurrency no boot. Filas auxiliares: `RABBITMQ_RETRY_QUEUE=fleetcore.retry` e `RABBITMQ_DLQ=fleetcore.dead-letter`.

## Observabilidade e feature toggles

- `DomainMetricsService` incrementa contadores de eventos e prepara exposição para Prometheus/Grafana.
- Logs estruturados do Nest registram fallbacks de auditoria, erros de mensageria e tentativas automáticas.
- `FeatureToggleService` lê `FEATURE_FLAGS_*` (cache, eventos, worker, swagger), permitindo ligar/desligar recursos sem mudanças de código.

Com esse conjunto, é possível revogar (e bloquear) sessões específicas, proteger o banco com cache/idempotência/lock/rate limit, auditar todas as operações sensíveis e manter integrações assíncronas resilientes, atendendo aos requisitos de segurança e observabilidade do desafio.

> Todas essas capacidades são **aditivas**: a estrutura e o fluxo originais (módulos, camadas, endpoints e nomes de variáveis existentes) foram preservados.
