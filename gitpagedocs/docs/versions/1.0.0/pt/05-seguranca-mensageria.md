# Segurança, Auditoria e Mensageria

Autenticação, rastreabilidade e integrações assíncronas caminham juntas para manter a plataforma segura e observável.

## Autenticação e autorização

- **Endpoints**: `POST /auth/login`, `POST /auth/register`, `POST /auth/logout` e `GET /auth/me` definidos em `backend/src/modules/auth/interfaces/http/auth.controller.ts`.
- **Estratégia JWT**: `JwtStrategy` valida o token e confirma se o `sessionId` ainda está ativo no Redis antes de liberar o acesso.
- **Sessões**: `AuthSessionService` armazena dados de sessão com TTL (`AUTH_SESSION_TTL_SECONDS`); logout ou redefinição de senha removem a sessão imediatamente.
- **Guards e decorators**: `JwtAuthGuard`, `RolesGuard`, `@Roles()` e `@Public()` controlam acesso. `SanitizeInputPipe` + `ThrottlerGuard` (configuração em `backend/src/apps/api/security/security-setup.ts`) evitam ataques simples.

## Auditoria

- `AuditInterceptor` envolve rotas privadas, registra request/response, identifica o ator autenticado e gera `correlationId`.
- `AuditService` publica a mensagem na fila `audit.event`; se RabbitMQ estiver indisponível, `AuditWriterService` grava diretamente em MongoDB.
- O worker opcional (`backend/src/apps/audit-worker`) processa o backlog quando `FEATURE_FLAGS_AUDIT_ASYNC_WORKER` está habilitado.

## Mensageria RabbitMQ

- Eventos de domínio (`VehicleCreatedEvent`, `VehicleUpdatedEvent`, etc.) são emitidos pelos agregados da frota.
- `FleetDomainEventListener` encaminha os eventos para o `MessagingService`, que publica no exchange `fleetcore.events` (routing keys `vehicle.*`, `brand.*`, `model.*`).
- `VehicleEventsConsumer` mostra como consumir e processar mensagens, servindo de base para integrações futuras.
- `ResilienceService` aplica retries, timeout e circuit breaker nas operações com RabbitMQ para evitar falhas em cascata.

## Observabilidade e feature toggles

- `DomainMetricsService` incrementa contadores de eventos e prepara exposição para Prometheus/Grafana.
- Logs estruturados do Nest registram fallbacks de auditoria, erros de mensageria e tentativas automáticas.
- `FeatureToggleService` lê `FEATURE_FLAGS_*` (cache, eventos, worker, swagger), permitindo ligar/desligar recursos sem mudanças de código.

Com esse conjunto, é possível revogar sessões específicas, auditar todas as operações sensíveis e manter integrações assíncronas resilientes, atendendo aos requisitos de segurança e observabilidade do desafio.
