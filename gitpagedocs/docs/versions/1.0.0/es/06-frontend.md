# Frontend y Experiencia

El cliente web usa **Next.js 16 (App Router)** con **React 19** y el patrón **Feature-Sliced Design (FSD)** para mantener preocupaciones modulares y reutilizables.

## Estructura FSD

- `app/` — routing, layout global y estilos.
- `entities/` — contratos de dominio (Vehicle, Brand, Model), UI compartida (por ejemplo, `vehicle-table`) y hooks de API.
- `features/` — funcionalidades aisladas como formularios de vehículos, flujos de gestión y barras de filtros.
- `processes/` — lógica transversal (flujos de autenticación, store de Redux, `ThemeProvider`).
- `shared/` — kit de UI, utilidades, cliente Axios, almacenamiento de tokens y esquemas Zod exportados desde el backend.
- `widgets/` — bloques de UI compuestos (AppShell, paneles de dashboard, tableros de referencia).

## Manejo de estado y datos

- **Redux Toolkit** guarda **solo** el estado de autenticación (un único reducer `auth`) y expone hooks tipados. El tema NO vive en Redux.
- **React Query** gestiona el fetching/mutaciones del CRUD de flota (`entities/*/api`) con query keys e invalidación en cada mutación, a través de Axios.
- El **cliente HTTP** Axios (`shared/api/http-client.ts`) adjunta automáticamente el JWT desde el token-storage y reinicia la sesión en respuestas 401.

## Validación compartida

- Los esquemas Zod se generan en el backend y se importan en el frontend (`frontend/src/shared/schemas`).
- Helpers en `shared/lib/zod-helpers` garantizan mensajes de error consistentes.

## Tema amarillo y responsividad

- Paletas duales **amarillas** claro/oscuro definidas en `globals.css` como **única fuente de verdad** (no se inyectan vía JS ni viven en Redux).
- El tema se aplica alternando la clase `light`/`dark` mediante `ThemeProvider` + un script anti-FOUC; la preferencia se guarda en `localStorage` (`fleetcore.theme-preference`).
- `NEXT_PUBLIC_START_THEME` define el tema por defecto (claro u oscuro) sin recompilar.
- Los componentes fueron refactorizados para layouts mobile-first: el contenido se centra en pantallas pequeñas y se alinea en columnas en viewports mayores.

## Páginas

- `(auth)`: login, register y recover.
- `(protected)`: dashboard, vehicles, brands, models y profile.

## UX de CRUD y accesibilidad

- **CRUD estandarizado**: un `ConfirmDialog` reutilizable (`shared/ui`) reemplaza `window.confirm` en las eliminaciones, y la edición se realiza en un `Modal` (`vehicle-workbench` y `reference-data-board`).
- **`SelectField` personalizado**: dropdown con portal y navegación por teclado montado sobre un `<select>` nativo oculto, para mantener la integración con react-hook-form, el valor controlado y el reset.
- Botones, tablas y formularios usan marcado semántico y proporcionan feedback (`InlineMessage`, estados deshabilitados).
- La navegación mobile replica las acciones de escritorio, preservando las mismas rutas y opciones.
- Los inputs fuerzan placas en mayúsculas, ofrecen pistas enmascaradas y mensajes de error descriptivos.

## Pruebas y linting

- Pruebas unitarias con Jest + React Testing Library (`frontend/tests/unit`): slice de `auth`, `ConfirmDialog` y `SelectField`. El `testMatch` de Jest acepta `.spec.ts` y `.spec.tsx`.
- Escenarios e2e con Playwright en `frontend/tests/e2e` validan la página de login.
- ESLint (preset Next.js + reglas personalizadas) corre mediante `npm run lint`.

El resultado es una interfaz responsiva y consciente del tema que consume las mismas reglas de validación que el backend, brindando una experiencia pulida para operadores.
