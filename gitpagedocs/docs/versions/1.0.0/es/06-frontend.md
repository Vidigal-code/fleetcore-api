# Frontend y Experiencia

El cliente web usa **Next.js 14 (App Router)** y el patrón **Feature-Sliced Design (FSD)** para mantener preocupaciones modulares y reutilizables.

## Estructura FSD

- `app/` — routing, layout global y estilos.
- `entities/` — contratos de dominio (Vehicle, Brand, Model), UI compartida (por ejemplo, `vehicle-table`) y hooks de API.
- `features/` — funcionalidades aisladas como formularios de vehículos, flujos de gestión y barras de filtros.
- `processes/` — lógica transversal (flujos de autenticación, store de Redux, proveedor de temas).
- `shared/` — kit de UI, utilidades, cliente Axios, almacenamiento de tokens y esquemas Zod exportados desde el backend.
- `widgets/` — bloques de UI compuestos (AppShell, paneles de dashboard, tableros de referencia).

## Manejo de estado y datos

- **Redux Toolkit** guarda el estado de autenticación (slice `auth`) y expone hooks tipados.
- **React Query** gestiona el fetching/mutaciones (`useVehiclesQuery`, `useCreateVehicleMutation`, etc.) a través de Axios.
- El **cliente HTTP** adjunta automáticamente el JWT y maneja el reseteo en respuestas 401.

## Validación compartida

- Los esquemas Zod se generan en el backend y se importan en el frontend (`frontend/src/shared/schemas`).
- Helpers en `shared/lib/zod-helpers` garantizan mensajes de error consistentes.

## Temas naranjas y responsividad

- Paletas duales naranja claro/oscuro definidas en `globals.css`, aplicadas por `ThemeProvider`.
- `NEXT_PUBLIC_START_THEME` permite elegir el tema por defecto (claro u oscuro) sin recompilar.
- Los componentes fueron refactorizados para layouts mobile-first: el contenido se centra en pantallas pequeñas y se alinea en columnas en viewports mayores.

## UX y accesibilidad

- Botones, tablas y formularios usan marcado semántico y proporcionan feedback (`InlineMessage`, estados deshabilitados).
- La navegación mobile replica las acciones de escritorio, preservando las mismas rutas y opciones.
- Los inputs fuerzan placas en mayúsculas, ofrecen pistas enmascaradas y mensajes de error descriptivos.

## Pruebas y linting

- Pruebas unitarias con React Testing Library (`frontend/tests/unit`).
- Escenarios e2e con Playwright en `frontend/tests/e2e` validan la página de login y el render del shell.
- ESLint (preset Next.js + reglas personalizadas) corre mediante `npm run lint`.

El resultado es una interfaz responsiva y consciente del tema que consume las mismas reglas de validación que el backend, brindando una experiencia pulida para operadores.
