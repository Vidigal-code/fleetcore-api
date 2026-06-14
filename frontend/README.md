# Fleetcore Web

Client web construído com Next.js 16 (React 19) utilizando o padrão Feature-Sliced Design (FSD). Consome a API Fleetcore, compartilha validações Zod com o backend e oferece dashboards responsivos para gestão da frota.

## 🇧🇷 Descrição em Português
<details>
<summary><strong>Ver detalhes</strong></summary>

### Arquitetura
- App Router (`src/app`) com grupo público (`(auth)`) e grupo protegido (`(protected)`): dashboard, vehicles, brands, models e profile.
- Slices FSD:
  - `entities/` – tipos, clientes React Query e UI base por entidade (vehicle, brand, model).
  - `features/` – formulários, filtros, fluxos de auth e toggle de tema reutilizáveis.
  - `widgets/` – composições (ex.: `vehicle-workbench`, `reference-data-board`, layout).
  - `processes/` – providers globais (Redux, React Query, Theme) e guards `RequireAuth`/`RequireGuest`.
  - `shared/` – componentes de UI, clientes Axios/React Query, schemas Zod, rotas e utilitários.

### Execução
```bash
npm install
npm run dev          # desenvolvimento (porta configurada no .env)
npm run build        # build de produção
npm run start        # serve o build gerado
```

### Variáveis de ambiente (`envexample.txt` na raiz)
| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_API_URL` | Endpoint público da API (ex.: `http://localhost:3000/api`) |
| `NEXT_PUBLIC_START_THEME` | Tema inicial (`light` ou `dark`) |
| `NEXT_PUBLIC_APP_NAME` | Nome exibido na UI |

### Qualidade
- `npm run lint` – ESLint (Next.js + TypeScript).
- `npm test` – Jest + React Testing Library (`tests/unit`: auth slice, `ConfirmDialog`, `SelectField`).
- `npm run test:e2e` – Playwright (`tests/e2e`: fluxo de login; requer API e web em execução).

### Pontos de destaque
- Autenticação via Redux Toolkit — a store mantém **apenas** o estado de autenticação (`processes/app/store`, `processes/auth`).
- Fetching e cache com React Query (`entities/*/api`), com query keys e invalidação nas mutações.
- Esquemas Zod compartilhados com o backend (`shared/schemas`).
- Tema amarelo claro/escuro: as cores vivem no `globals.css` (fonte única de verdade) e são aplicadas por troca de classe via `ThemeProvider`, com script anti-FOUC; a preferência é guardada em `localStorage` (`fleetcore.theme-preference`).
- CRUD padronizado: `ConfirmDialog` reutilizável substitui `window.confirm` em exclusões, edição em `Modal` e `SelectField` customizado (dropdown com portal e navegação por teclado) sobre um `<select>` nativo oculto para integração com formulários.
- Integração com a API: o token JWT é injetado via interceptor Axios (`shared/api`) e o `401` dispara logout automático. O backend mantém a sessão no Redis (TTL deslizante) e aplica rate limit — o cliente pode receber `429 { success, message, retryAfter }`; mutações aceitam o header opcional `Idempotency-Key`.

</details>

## 🇺🇸 English Description
<details>
<summary><strong>View details</strong></summary>

### Architecture
- App Router project (`src/app`) with a public group (`(auth)`) and a protected group (`(protected)`): dashboard, vehicles, brands, models and profile.
- FSD slices:
  - `entities/` – domain types, React Query clients and base UI per entity (vehicle, brand, model).
  - `features/` – reusable forms, filter bars, auth flows and theme toggle.
  - `widgets/` – page-level compositions (`vehicle-workbench`, `reference-data-board`, layout).
  - `processes/` – global providers (Redux, React Query, Theme) and `RequireAuth`/`RequireGuest` guards.
  - `shared/` – UI kit, Axios/React Query clients, Zod schemas, routes and utilities.

### Running
```bash
npm install
npm run dev          # development (port configured in .env)
npm run build        # production build
npm run start        # serve the built app
```

### Environment variables (`envexample.txt` at the repo root)
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Public API endpoint (e.g. `http://localhost:3000/api`) |
| `NEXT_PUBLIC_START_THEME` | Initial theme (`light` or `dark`) |
| `NEXT_PUBLIC_APP_NAME` | Display name in the UI |

### Quality
- `npm run lint` – ESLint (Next.js + TypeScript).
- `npm test` – Jest + Testing Library (`tests/unit`: auth slice, `ConfirmDialog`, `SelectField`).
- `npm run test:e2e` – Playwright (`tests/e2e`: login flow; API + app must be running).

### Highlights
- Authentication handled via Redux Toolkit — the store keeps **only** the auth state (`processes/app/store`, `processes/auth`).
- Data fetching with React Query (`entities/*/api`), with query keys and invalidation on mutations.
- Validation schemas shared with the backend (`shared/schemas`).
- Yellow light/dark theme: colors live in `globals.css` (single source of truth) and are applied by class toggling via `ThemeProvider` with an anti-FOUC script; the preference is stored in `localStorage` (`fleetcore.theme-preference`).
- Standardized CRUD: a reusable `ConfirmDialog` replaces `window.confirm` for deletions, editing happens in a `Modal`, and a custom `SelectField` (portal dropdown with keyboard navigation) is backed by a hidden native `<select>` for form integration.
- API integration: the JWT is injected via an Axios interceptor (`shared/api`) and a `401` triggers automatic logout. The backend keeps the session in Redis (sliding TTL) and enforces rate limiting — the client may receive `429 { success, message, retryAfter }`; mutations accept the optional `Idempotency-Key` header.

</details>
