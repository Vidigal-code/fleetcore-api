# Arquitetura da Solução

Este panorama reforça como o backend, o domínio e os serviços de suporte se conectam.

## Backend NestJS

- Modularização em `auth`, `fleet`, `users`, `audit` e `messaging`.
- Guardas globais (`JwtAuthGuard`, `RolesGuard`, `RateLimitGuard`) e `AuthSessionService` com Redis (TTL deslizante + lock).
- Eventos de domínio propagados por `FleetDomainEventListener` para RabbitMQ.

Saiba mais na seção Arquitetura Backend do menu.

## Modelagem e persistência

- Entidades do TypeORM com migração única (`1717845600000-InitSchema.ts`).
- Agregados que preservam invariantes e utilizam `UnitOfWork` para transações.
- Seeds (`UsersService.ensureAdminSeed`) e dataset inicial de veículos.

Veja detalhes na seção Modelagem de Dados e Domínio.

## Observabilidade

- Interceptor de auditoria (rotas não-públicas) com evento enriquecido, consumido pelo `audit-worker` e escrito em MongoDB.
- Métricas de domínio para monitoramento.
- Resiliência configurável via `ResilienceService` (retry/fallback/rollback) e feature toggles.

Consulte a seção Segurança, Auditoria e Mensageria para o fluxo completo.
