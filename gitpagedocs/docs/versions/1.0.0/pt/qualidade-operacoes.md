# Qualidade e Operações

Visão condensada dos rituais de qualidade e das rotinas operacionais que sustentam o produto.

## Qualidade

- `npm run lint`, `npm test`, `npm run test:e2e` garantem padrões em backend e frontend.
- Cobertura Jest para serviços, guards e integrações.
- Playwright valida fluxos-chave do frontend.

## Operações

- Docker Compose levanta SQL Server, Redis, RabbitMQ, MongoDB, API, `audit-worker` e frontend.
- `npm run generate:openapi` e `npm run export:schemas` mantêm documentação e validação sincronizadas.
- Feature toggles permitem ajustar auditoria, cache e eventos sem alterar código.
- Proteções operacionais via Redis: rate limit dedicado (`RATE_LIMIT_*`), idempotência (`Idempotency-Key`) e lock distribuído (`REDIS_LOCK_TTL`); resiliência com retry/fallback/rollback (`RETRY_MAX_ATTEMPTS`, `RETRY_INITIAL_DELAY`) e worker de auditoria (`WORKER_CONCURRENCY`).

## Referências

- **Qualidade e Testes**
- **Guia de Execução e Troubleshooting**
