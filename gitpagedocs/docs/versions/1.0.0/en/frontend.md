# Front-end

High-level summary of the Next.js client and how it integrates with the platform.

## Patterns

- **Feature-Sliced Design (FSD):** layers for `entities`, `features`, `widgets`, `processes` and `shared` keep code modular.
- **Redux Toolkit:** stores auth state and preferences with typed hooks.
- **React Query:** orchestrates REST calls with caching and optimistic updates.

## Experience

- Orange light/dark themes switched via `NEXT_PUBLIC_START_THEME`.
- Mobile-first layouts with responsive components and consistent inline feedback.
- Validation relies on Zod schemas exported from the backend.

## Explore further

- [Frontend and Experience](./06-frontend.md)
- [Quality and Testing](./08-quality-testing.md)
