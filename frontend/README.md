# Fleetcore Web

## 🇧🇷 Descrição em Português
<details>
<summary><strong>Ver Detalhes</strong></summary>

### Visão Geral
- Interface Next.js 14 com arquitetura Feature-Sliced Design para o módulo de gestão de frota.
- Consome a API NestJS via Redux Toolkit (auth) e React Query (dados), usando Axios com interceptors.
- Design responsivo com Tailwind, tema claro/escuro em laranjas e componentes reutilizáveis.

### Estrutura FSD
- `shared/` – utilitários, providers, tokens de design, UI base.
- `entities/` – hooks e modelos de domínio (brand, model, vehicle).
- `features/` – formulários e filtros reutilizáveis.
- `widgets/` – composições de alto nível (ex.: `vehicle-workbench`, `reference-data-board`).
- `processes/` – providers globais, guards (`RequireAuth`).
- `app/` – páginas App Router (`layout.tsx`, rotas protegidas, login).

### Execução
```bash
npm install
npm run dev          # desenvolvimento (porta configurada em .env)
npm run build        # build standalone
npm run start        # servir build produzido
```

### Variáveis de Ambiente
Consulte `frontend/.env.sample`.

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Endpoint público da API (`http://host:port/api`) |
| `NEXT_PUBLIC_APP_NAME` | Nome exibido no cabeçalho/UI |
| `NEXT_PUBLIC_CACHE_TTL_SECONDS` | TTL base para React Query |

### Segurança e Qualidade
- Login via JWT com persistência client-side segura (axios + interceptors).
- Guards de rota (`RequireAuth`) e hidratação de sessão.
- Todos os componentes seguem princípios DRY, sem hardcodes de cores/strings.

### Testes
```bash
npm run lint
npm test            # Jest + Testing Library
npm run test:e2e    # Playwright (requer app em execução)
```

</details>

## 🇺🇸 English Description
<details>
<summary><strong>View Details</strong></summary>

### Overview
- Next.js 14 interface built with Feature-Sliced Design for the fleet management module.
- Integrates with the NestJS API using Redux Toolkit (auth) and React Query (data) backed by Axios interceptors.
- Responsive UI powered by Tailwind, light/dark orange themes and reusable components.

### FSD Layout
- `shared/` – utilities, providers, design tokens, base UI components.
- `entities/` – domain-specific hooks/models (brand, model, vehicle).
- `features/` – reusable forms and filter bars.
- `widgets/` – high-level compositions (e.g., `vehicle-workbench`, `reference-data-board`).
- `processes/` – global providers, auth guards (`RequireAuth`).
- `app/` – App Router pages (`layout.tsx`, protected routes, login).

### Running
```bash
npm install
npm run dev          # development (port defined in .env)
npm run build        # standalone build
npm run start        # serve the built app
```

### Environment Variables
See `frontend/.env.sample`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Public API endpoint (`http://host:port/api`) |
| `NEXT_PUBLIC_APP_NAME` | Display name in the UI |
| `NEXT_PUBLIC_CACHE_TTL_SECONDS` | Base TTL for React Query |

### Security & Quality
- JWT login with secure client persistence using Axios interceptors.
- Route guards (`RequireAuth`) and session hydration ensure protected navigation.
- Components remain DRY with centralized tokens (no hardcoded strings/colors).

### Tests
```bash
npm run lint
npm test            # Jest + Testing Library
npm run test:e2e    # Playwright (app must be running)
```

</details>
