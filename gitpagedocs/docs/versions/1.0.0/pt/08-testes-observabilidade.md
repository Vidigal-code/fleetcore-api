# Qualidade e Testes

Garantir cobertura automatizada foi requisito explícito do desafio. A solução contempla testes unitários, integrados, end-to-end e ferramentas de verificação estática para backend e frontend.

## Backend (Jest)

- **Unitários** (`backend/tests/unit`) cobrem serviços de frota, auth, auditoria, toggles e repos, simulando dependências com `jest.fn()`. Suítes novas cobrem as proteções aditivas:
  - `auth/auth-session.service.spec.ts` — `refresh` (TTL deslizante), `lock`/`unlock`/`isLocked`.
  - `shared/redis-lock.service.spec.ts` — aquisição, liberação compare-and-del e renovação do lock distribuído.
  - `shared/idempotency.service.spec.ts` — marcação de chave e detecção de duplicidade.
  - `shared/rate-limit.service.spec.ts` — contagem por usuário/IP/endpoint e bloqueio.
  - `shared/resilience.service.spec.ts` — estendido para cobrir `executeWithFallback` e `executeWithRollback`.
- **Integração** (`backend/tests/integration`) valida a busca e a ordenação de veículos contra SQLite in-memory.
- **E2E** (`backend/tests/e2e`) utiliza SQLite in-memory para validar fluxos reais de veículos (criação/listagem) e segurança.
- **Comandos**:
  - `npm run lint`
  - `npm test`
  - `npm run test:e2e`
  - `npm run test:cov`

## Frontend (Jest + Playwright)

- **Unitários** (`frontend/tests/unit`) validam o auth slice (Redux), o `ConfirmDialog` e o `SelectField`. O `testMatch` do Jest aceita `.spec.ts` e `.spec.tsx`.
- **E2E** (`frontend/tests/e2e`) com Playwright asseguram o fluxo de login.
- **Comandos**:
  - `npm run lint`
  - `npm test`
  - `npm run test:e2e`

## Qualidade contínua

- ESLint configurado para ambos os projetos (regras do Next + TypeScript + Prettier).
- Scripts de geração de schemas/OpenAPI mantêm o contrato compartilhado entre camadas.
- Feature toggles e Resilience Service reduzem falhas intermitentes em ambientes externos (RabbitMQ/Audit).

## Observabilidade

- Logs padronizados do NestJS indicam retries, circuit breakers, fallback/rollback de auditoria e bloqueios de rate limit (`rate_limit.blocked`).
- Métricas de domínio (via `DomainMetricsService`) possibilitam instrumentação futura.
- RabbitMQ (fila `fleetcore.audit`) e MongoDB preservam trilhas assíncronas para auditoria detalhada, agora com campos enriquecidos (`eventId`, `correlationId`, `requestId`, `sessionId`, `route`, `statusCode`) e metadados de processamento do `audit-worker`.

## Interpretação

Comandos de lint e testes são executados antes de cada entrega, garantindo aderência aos critérios de “Testes automatizados” e “Qualidade do README/organização”.
