# Frontend e Experiência

O frontend foi criado em **Next.js 14 (App Router)** seguindo o padrão **Feature-Sliced Design (FSD)**, garantindo separação clara entre camadas e reutilização de componentes.

## Estrutura FSD

- `app/` — roteamento, `layout.tsx` e estilos globais.
- `entities/` — contratos de domínio (Vehicle, Brand, Model) + APIs e componentes básicos (ex.: `vehicle-table`).
- `features/` — funcionalidades isoladas, como formulários (`vehicles/manage`, `brands/manage`, `models/manage`) e filtros.
- `processes/` — fluxos compartilhados (auth, providers, store Redux, tema).
- `shared/` — bibliotecas (`lib`), UI reutilizável, schemas Zod exportados do backend, utilidades.
- `widgets/` — blocos compostos (AppShell, dashboards, boards de referência).

## Gerenciamento de estado e dados

- **Redux Toolkit**: slice `auth` mantém estado de autenticação, armazenado em `processes/auth`.
- **React Query**: hooks (`useVehiclesQuery`, `useCreateVehicleMutation`, etc.) centralizam chamadas REST via Axios (`shared/api/http-client`).
- **Token storage**: `shared/lib/token-storage` guarda tokens JWT no `sessionStorage`. O `httpClient` injeta o header `Authorization` automaticamente.

## Validações compartilhadas

- Schemas Zod exportados do backend (script `npm run export:schemas`) evitam duplicidade de validações para placa, chassi, etc.
- Helpers (`shared/lib/zod-helpers`) garantem mensagens consistentes em português.

## Tema laranja responsivo

- Temas claro/escuro (laranja suave x laranja profundo) definidos em `globals.css` e controlados por `ThemeProvider`.
- Variável `NEXT_PUBLIC_START_THEME` permite iniciar em `light` ou `dark` sem recompilar.
- Componentes foram ajustados para comportamento **mobile-first**: conteúdo centralizado em telas pequenas e distribuição lateral em desktops.

## UX e acessibilidade

- Componentes usam tipografia consistente, alto contraste e feedback textual para erros/sucesso (`InlineMessage`).
- Paginação, tabelas e formulários respondem a interações por teclado e exibem textos alternativos.
- Menu mobile acessível, com alternância e estado controlado (`AppShell`, `MobileMenu`).

## Testes e qualidade

- Testes unitários com React Testing Library (`frontend/tests/unit`).
- Playwright E2E (`frontend/tests/e2e`) validando fluxo de login e interação básica.
- `npm run lint` aplica ESLint (config Next) garantindo padronização.

## Resultado

O frontend apresenta uma experiência moderna, customizada com identidade laranja, responsiva e alinhada ao backend — consumindo as mesmas regras de validação e oferecendo ferramentas completas para operadores gerenciarem a frota.
