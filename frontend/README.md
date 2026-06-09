# Fleetcore Web

Client web construído com Next.js 14 utilizando o padrão Feature-Sliced Design (FSD). Consome a API Fleetcore, compartilha validações Zod geradas no backend e oferece dashboards responsivos para gestão da frota.

## 🇧🇷 Descrição em Português
<details>
<summary><strong>Ver detalhes</strong></summary>

### Arquitetura
- App Router (`src/app`) com layouts protegidos e página de login.
- Slices FSD:
  - `entities/` – tipos, hooks e UI base por entidade (vehicle, brand, model).
  - `features/` – formulários, filtros e toggle de tema reutilizáveis.
  - `widgets/` – composições (ex.: `vehicle-workbench`, `reference-data-board`).
  - `processes/` – providers globais (Redux, React Query, Theme), guards `RequireAuth`.
  - `shared/` – componentes de UI, clientes Axios/React Query, schemas compartilhados, utilitários.

### Execução
```bash
npm install
npm run dev          # desenvolvimento (porta configurada em .env)
npm run build        # build de produção
npm run start        # serve o build gerado
```

### Variáveis de ambiente (`frontend/.env.sample`)
| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_API_URL` | Endpoint público da API (ex.: `http://localhost:3000/api`) |
| `NEXT_PUBLIC_START_THEME` | Tema inicial (`light` ou `dark`) |
| `NEXT_PUBLIC_APP_NAME` | Nome exibido na UI |

### Qualidade
- `npm run lint` – ESLint (Next.js + TypeScript).
- `npm test` – Jest + React Testing Library.
- `npm run test:e2e` – Playwright (requer API e web em execução).

### Pontos de destaque
- Autenticação via Redux Toolkit (`processes/app/store`, `processes/auth`).
- Fetching e cache com React Query (`entities/*/api`).
- Esquemas Zod compartilhados com o backend (`shared/schemas`).
- Tema laranja claro/escuro controlado por `ThemeProvider` e guardado em `localStorage`.

</details>

## 🇺🇸 English Description
<details>
<summary><strong>View details</strong></summary>

### Architecture
- App Router project (`src/app`) with protected layouts and login page.
- FSD slices:
  - `entities/` – domain-layer hooks/types/UI (vehicle, brand, model).
  - `features/` – reusable forms, filter bars, theme toggle.
  - `widgets/` – page-level compositions (dashboard, vehicle workbench).
  - `processes/` – global providers (Redux, React Query, Theme), auth guards (`RequireAuth`).
  - `shared/` – UI kit, Axios/React Query clients, shared schemas, utilities.

### Running
```bash
npm install
npm run dev          # development
npm run build        # production build
npm run start        # serve the built app
```

### Environment variables (`frontend/.env.sample`)
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Public API endpoint (e.g. `http://localhost:3000/api`) |
| `NEXT_PUBLIC_START_THEME` | Initial theme (`light` or `dark`) |
| `NEXT_PUBLIC_APP_NAME` | Display name in the UI |

### Quality
- `npm run lint` – ESLint (Next.js + TypeScript).
- `npm test` – Jest + Testing Library.
- `npm run test:e2e` – Playwright end-to-end coverage (API + app must be running).

### Highlights
- Authentication handled via Redux Toolkit store and hooks.
- Data fetching with React Query (see `entities/*/api`).
- Validation schemas shared with the backend (`shared/schemas`).
- Light/dark orange themes controlled by `ThemeProvider` and stored in `localStorage`.

</details>
