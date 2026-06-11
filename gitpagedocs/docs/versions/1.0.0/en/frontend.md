# Front-end

High-level summary of the Next.js client and how it integrates with the platform.

## Patterns

- **Next.js 16 + React 19** with the App Router.
- **Feature-Sliced Design (FSD):** layers for `app`, `processes`, `entities`, `features`, `widgets` and `shared` keep code modular.
- **Redux Toolkit:** holds **only** the auth state (single `auth` reducer); theme is not in Redux.
- **React Query:** orchestrates fleet CRUD with query-key factories and invalidation on mutations.

## Experience

- **Yellow/amber** light/dark themes; colors live in `globals.css` (single source of truth) and the theme is toggled via the `light`/`dark` class by `ThemeProvider`. `NEXT_PUBLIC_START_THEME` sets the default; the preference is stored in localStorage (`fleetcore.theme-preference`).
- Standardized CRUD UX: a reusable `ConfirmDialog` for deletes, edit forms inside a `Modal`, and a custom themed `SelectField` (portal + keyboard navigation over a hidden native `<select>`).
- Mobile-first layouts with responsive components and consistent inline feedback.
- Validation relies on Zod schemas exported from the backend.

## Explore further

- **Frontend and Experience**
- **Quality and Testing**
