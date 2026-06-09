# Arquitetura da Solução

Este panorama reforça como o backend, o domínio e os serviços de suporte se conectam.

## Backend NestJS

- Modularização em `auth`, `fleet`, `users`, `audit` e `messaging`.
- Guardas globais (`JwtAuthGuard`, `RolesGuard`) e `AuthSessionService` com Redis.
- Eventos de domínio propagados por `FleetDomainEventListener` para RabbitMQ.

Saiba mais em [Arquitetura Backend](./03-arquitetura-backend.md).

## Modelagem e persistência

- Entidades do TypeORM com migração única (`1717845600000-InitSchema.ts`).
- Agregados que preservam invariantes e utilizam `UnitOfWork` para transações.
- Seeds (`UsersService.ensureAdminSeed`) e dataset inicial de veículos.

Veja detalhes em [Modelagem de Dados e Domínio](./04-modelagem-dominio.md).

## Observabilidade

- Interceptor de auditoria escrevendo em MongoDB.
- Métricas de domínio para monitoramento.
- Resiliência configurável via `ResilienceService` e feature toggles.

Consulte [Segurança, Auditoria e Mensageria](./05-seguranca-mensageria.md) para o fluxo completo.
