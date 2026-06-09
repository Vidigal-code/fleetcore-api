# Frontend and Experience

The web client is built with Next.js 14 (App Router) and organised using the Feature-Sliced Design (FSD) methodology. Each slice groups code by responsibility so UI, data fetching and state can evolve independently.

## Project layout

| Slice | Purpose | Examples |
|-------|---------|----------|
| `app/` | Route definitions, layouts, metadata and global styles | `app/page.tsx`, `app/dashboard/page.tsx`, `app/layout.tsx`, `globals.css` |
| `entities/` | Domain types, API clients and reusable widgets per entity | `entities/vehicle/{api,model,ui}`, `entities/brand`, `entities/model` |
| `features/` | User-facing features (forms, filters, theme toggle, login flow) | `features/vehicles/manage`, `features/models/manage`, `features/auth/login`, `features/theme/toggle` |
| `widgets/` | Composite UI blocks mounted on pages | `widgets/layout/app-shell.tsx`, `widgets/dashboard/dashboard-screen.tsx`, `widgets/fleet/vehicle-workbench.tsx` |
| `processes/` | Cross-cutting orchestration (Redux store, providers, auth hydrators) | `processes/app/store`, `processes/app/providers`, `processes/auth` |
| `shared/` | Design system, Axios/React Query clients, schemas, utilities | `shared/ui/*.tsx`, `shared/api`, `shared/schemas`, `shared/lib` |

## State management and data flow

- **Redux Toolkit** (`processes/app/store`) persists authentication state, theme preference and exposes typed hooks in `hooks.ts`.
- **React Query** drives fleet CRUD operations using API clients in `entities/*/api` and handles optimistic updates and refetching.
- **HTTP client** located at `shared/api/http-client.ts` attaches JWT tokens from `shared/lib/token-storage.ts`, handles 401 resets and normalises errors via `http-error.ts`.
- **Schema sharing**: forms reuse backend Zod schemas exported to `shared/schemas/fleet.ts`, ensuring consistent validation messages through helpers in `shared/lib/zod-helpers.ts`.

## Experience and theming

- Light/dark orange palettes are defined in `shared/config/theme.ts` and applied by `processes/app/providers/theme-provider.tsx`.
- `NEXT_PUBLIC_START_THEME` selects the initial theme; users can toggle it through `features/theme/toggle/ui/theme-toggle.tsx` (stored in localStorage under `fleetcore.theme-preference`).
- Layout components adapt to mobile and desktop via CSS grid utilities in `globals.css` and responsive widgets.
- Tables, forms and filter bars supply inline validation feedback powered by shared UI components (`shared/ui/inline-message.tsx`, `input-field.tsx`, `vehicle-table.tsx`).

## Testing and linting

- React Testing Library specs in `frontend/tests/unit` cover reducers, hooks and components.
- Playwright e2e scenarios in `frontend/tests/e2e` verify login/logout, dashboard rendering and CRUD flows.
- ESLint (Next.js preset + project rules) runs with `npm run lint`; formatting is handled by Prettier configured in the root.

Together these slices deliver a responsive operator experience that mirrors backend validation, securely stores sessions and provides quick access to fleet data.
