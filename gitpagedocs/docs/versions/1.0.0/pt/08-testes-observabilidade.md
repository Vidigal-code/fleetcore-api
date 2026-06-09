# Qualidade e Testes

Garantir cobertura automatizada foi requisito explícito do desafio. A solução contempla testes unitários, integrados, end-to-end e ferramentas de verificação estática para backend e frontend.

## Backend (Jest)

- **Unitários** (`backend/tests/unit`) cobrem serviços de frota, auth, auditoria, toggles e repos, simulando dependências com `jest.fn()`.
- **Integração / e2e** (`backend/tests/e2e`) utilizam SQLite in-memory para validar fluxos reais de veículos (criação/listagem) e segurança.
- **Comandos**:
  - `npm run lint`
  - `npm test`
  - `npm run test:e2e`
  - `npm run test:cov`

## Frontend (Jest + Playwright)

- **Unitários** (`frontend/tests/unit`) validam reducers Redux e hooks críticos.
- **E2E** (`frontend/tests/e2e`) com Playwright asseguram renderização da tela de login e interações básicas.
- **Comandos**:
  - `npm run lint`
  - `npm test`
  - `npm run test:e2e`

## Qualidade contínua

- ESLint configurado para ambos os projetos (regras do Next + TypeScript + Prettier).
- Scripts de geração de schemas/OpenAPI mantêm o contrato compartilhado entre camadas.
- Feature toggles e Resilience Service reduzem falhas intermitentes em ambientes externos (RabbitMQ/Audit).

## Observabilidade

- Logs padronizados do NestJS indicam retries, circuit breakers e fallback de auditoria.
- Métricas de domínio (via `DomainMetricsService`) possibilitam instrumentação futura.
- RabbitMQ e MongoDB preservam trilhas assíncronas para auditoria detalhada.

## Interpretação

Comandos de lint e testes são executados antes de cada entrega, garantindo aderência aos critérios de “Testes automatizados” e “Qualidade do README/organização”.
