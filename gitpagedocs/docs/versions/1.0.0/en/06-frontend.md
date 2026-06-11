# Frontend and Experience

The web client is built with Next.js 16 (App Router) and React 19, organised using the Feature-Sliced Design (FSD) methodology. Each slice groups code by responsibility so UI, data fetching and state can evolve independently.

## Project layout

| Slice | Purpose | Examples |
|-------|---------|----------|
| `app/` | Route definitions, layouts, metadata and global styles | `app/(auth)/login`, `app/(protected)/dashboard/page.tsx`, `app/layout.tsx`, `globals.css` |
| `entities/` | Domain types, API clients and reusable widgets per entity | `entities/vehicle/{api,model,ui}`, `entities/brand`, `entities/model` |
| `features/` | User-facing features (forms, filters, theme toggle, login flow) | `features/vehicles/manage`, `features/models/manage`, `features/auth/login`, `features/theme/toggle` |
| `widgets/` | Composite UI blocks mounted on pages | `widgets/layout/app-shell.tsx`, `widgets/dashboard/dashboard-screen.tsx`, `widgets/fleet/vehicle-workbench.tsx` |
| `processes/` | Cross-cutting orchestration (Redux store, providers, auth hydrators) | `processes/app/store`, `processes/app/providers`, `processes/auth` |
| `shared/` | Design system, Axios/React Query clients, schemas, utilities | `shared/ui/*.tsx`, `shared/api`, `shared/schemas`, `shared/lib` |

## State management and data flow

- **Redux Toolkit** (`processes/app/store`) holds **only** the authentication state (a single `auth` reducer) and exposes typed hooks in `hooks.ts`. Theme preference is **not** kept in Redux.
- **React Query** drives fleet CRUD operations using API clients in `entities/*/api` with query-key factories and cache invalidation on mutations.
- **HTTP client** located at `shared/api/http-client.ts` attaches the JWT from `shared/lib/token-storage.ts`, resets on 401 and normalises errors via `http-error.ts`.
- **Schema sharing**: forms reuse backend Zod schemas exported to `shared/schemas/fleet.ts`, ensuring consistent validation messages through helpers in `shared/lib/zod-helpers.ts`.

## Pages

- **(auth)** — `login`, `register`, `recover`.
- **(protected)** — `dashboard`, `vehicles`, `brands`, `models`, `profile`.

## CRUD experience

- **ConfirmDialog** (`shared/ui/confirm-dialog.tsx`) replaces `window.confirm` for delete actions with a themed, accessible dialog.
- **Edit modals** — edit forms render inside a reusable `Modal` (used by `vehicle-workbench` and `reference-data-board`).
- **SelectField** (`shared/ui/select-field.tsx`) — a custom themed dropdown (portal + keyboard navigation) backed by a hidden native `<select>` so react-hook-form controlled values and resets keep working.

## Experience and theming

- Light/dark **yellow/amber** palettes are defined in `globals.css` as the single source of truth and applied by toggling the `light`/`dark` class via `processes/app/providers/theme-provider.tsx` (plus an anti-FOUC bootstrap script). Colors are not injected via JS and the theme is not stored in Redux.
- `NEXT_PUBLIC_START_THEME` selects the default theme; users can toggle it through `features/theme/toggle/ui/theme-toggle.tsx`, with the preference stored in localStorage under `fleetcore.theme-preference`.
- Layout components adapt to mobile and desktop via CSS grid utilities in `globals.css` and responsive widgets.
- Tables, forms and filter bars supply inline validation feedback powered by shared UI components (`shared/ui/inline-message.tsx`, `input-field.tsx`, `vehicle-table.tsx`).

## Testing and linting

- React Testing Library specs in `frontend/tests/unit` cover the auth slice, `ConfirmDialog` and `SelectField`. (Jest `testMatch` allows `.spec.ts` and `.spec.tsx`.)
- The Playwright e2e suite in `frontend/tests/e2e` verifies the login flow.
- ESLint (Next.js preset + project rules) runs with `npm run lint`; formatting is handled by Prettier.

Together these slices deliver a responsive operator experience that mirrors backend validation, securely stores sessions and provides quick access to fleet data.
