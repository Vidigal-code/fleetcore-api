# Frontend e Experiência

O frontend foi criado em **Next.js 16 (App Router)** com **React 19**, seguindo o padrão **Feature-Sliced Design (FSD)**, garantindo separação clara entre camadas e reutilização de componentes.

## Estrutura FSD

- `app/` — roteamento, `layout.tsx` e estilos globais.
- `entities/` — contratos de domínio (Vehicle, Brand, Model) + APIs e componentes básicos (ex.: `vehicle-table`).
- `features/` — funcionalidades isoladas, como formulários (`vehicles/manage`, `brands/manage`, `models/manage`) e filtros.
- `processes/` — fluxos compartilhados (auth, providers, store Redux, tema).
- `shared/` — bibliotecas (`lib`), UI reutilizável, schemas Zod exportados do backend, utilidades.
- `widgets/` — blocos compostos (AppShell, dashboards, boards de referência).

## Gerenciamento de estado e dados

- **Redux Toolkit**: a store guarda **apenas** o estado de autenticação (um único reducer `auth`). O tema **não** fica no Redux.
- **React Query**: hooks (`useVehiclesQuery`, `useCreateVehicleMutation`, etc.) conduzem o CRUD da frota via Axios (`shared/api/http-client`), com query keys e invalidação automática nas mutações.
- **Token storage**: `shared/lib/token-storage` guarda o token JWT. O `httpClient` injeta o header `Authorization` automaticamente e o reseta em respostas `401`.

## Validações compartilhadas

- Schemas Zod exportados do backend (script `npm run export:schemas`) evitam duplicidade de validações para placa, chassi, etc.
- Helpers (`shared/lib/zod-helpers`) garantem mensagens consistentes em português.

## Tema amarelo responsivo

- Temas claro/escuro com paleta **amarela**. As cores vivem no `globals.css` como **fonte única de verdade** (não são injetadas via JavaScript nem armazenadas no Redux).
- O tema é aplicado alternando a classe `light`/`dark` via `ThemeProvider` + um script anti-FOUC. A preferência é persistida no `localStorage` (`fleetcore.theme-preference`).
- Variável `NEXT_PUBLIC_START_THEME` define o tema padrão inicial sem recompilar.
- Componentes foram ajustados para comportamento **mobile-first**: conteúdo centralizado em telas pequenas e distribuição lateral em desktops.

## Páginas

- `(auth)`: login, register e recover.
- `(protected)`: dashboard, vehicles, brands, models e profile.

## UX de CRUD

- `ConfirmDialog` reutilizável (`shared/ui`) substitui o `window.confirm` nativo em todas as exclusões.
- Edição em `Modal` reutilizável (usado no `vehicle-workbench` e no `reference-data-board`).
- `SelectField` customizado (dropdown com portal e navegação por teclado) sobre um `<select>` nativo oculto, mantendo a compatibilidade com `react-hook-form` (valor controlado e reset).

## UX e acessibilidade

- Componentes usam tipografia consistente, alto contraste e feedback textual para erros/sucesso (`InlineMessage`).
- Paginação, tabelas e formulários respondem a interações por teclado e exibem textos alternativos.
- Menu mobile acessível, com alternância e estado controlado (`AppShell`, `MobileMenu`).

## Testes e qualidade

- Testes unitários com React Testing Library (`frontend/tests/unit`): auth slice, `ConfirmDialog` e `SelectField`.
- Playwright E2E (`frontend/tests/e2e`) validando o fluxo de login.
- O `testMatch` do Jest aceita `.spec.ts` e `.spec.tsx`.
- `npm run lint` aplica ESLint (config Next) garantindo padronização.

## Resultado

O frontend apresenta uma experiência moderna, customizada com identidade amarela, responsiva e alinhada ao backend — consumindo as mesmas regras de validação e oferecendo ferramentas completas para operadores gerenciarem a frota.
