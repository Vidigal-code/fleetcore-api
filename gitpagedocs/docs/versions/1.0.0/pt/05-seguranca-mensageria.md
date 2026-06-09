# Segurança, Auditoria e Mensageria

A plataforma combina autenticação forte, trilha de auditoria e integração assíncrona para garantir confiabilidade e rastreabilidade.

## Autenticação e autorização

- **JWT + RBAC**: `AuthController` expõe `POST /auth/login`, `POST /auth/register`, `POST /auth/logout` e `GET /auth/me`. O guard `JwtAuthGuard` valida o token, enquanto `RolesGuard` verifica roles (`UserRole.Admin`, `UserRole.Operator`).
- **Sessões em Redis**: `AuthSessionService` gera `sessionId` (UUID), armazena payload com TTL (`AUTH_SESSION_TTL_SECONDS`) e invalida no logout. O `JwtStrategy` consulta Redis antes de aceitar o token.
- **Sanitização e rate limiting**: o `SanitizeInputPipe` remove caracteres de controle e o `ThrottlerGuard` aplica limites configuráveis (`SECURITY_RATE_LIMIT_*`).

## Auditoria em MongoDB

- `AuditInterceptor` inspeciona todas as rotas privadas e registra request/response com `correlationId`.
- `AuditService` publica eventos na fila `audit.event`. Em caso de falha (ex.: RabbitMQ indisponível) persiste diretamente via `AuditWriterService` no MongoDB.
- Schemas Mongoose vivem em `backend/src/modules/audit/schemas` permitindo consulta posterior.

## Mensageria RabbitMQ

- `FleetDomainEventListener` escuta eventos de domínio e envia mensagens para a exchange `fleetcore.events` com rota `vehicle.*`, `brand.*`, `model.*`.
- `MessagingService` envolve `AmqpConnection` em políticas de retry/circuit breaker (`ResilienceService`).
- O consumidor `VehicleEventsConsumer` demonstra como integrar outros microsserviços (atualmente loga os payloads recebidos).

## Logs e métricas

- `DomainMetricsService` incrementa contadores por evento publicado, permitindo instrumentação futura.
- `Logger` padrão do Nest registra fallback de auditoria, erros de mensageria e tentativas de retry.

## Configuração por ambiente

- Variáveis no `.env` controlam **segredos** (`JWT_SECRET`), TTL de sessão, URIs de RabbitMQ/Mongo e flags de feature (`FEATURE_FLAGS`).
- `FeatureToggleService` permite desativar audit worker ou forward de eventos sem alterar código (útil para debug ou ambientes limitados).

## Benefícios

- Autenticação centralizada, com possibilidade de revogar sessão individualmente.
- Auditoria completa para cumprir exigências de compliance e rastreabilidade.
- Infraestrutura pronta para processamento assíncrono e replicação de eventos para outros domínios (ex.: billing, telemetria).
