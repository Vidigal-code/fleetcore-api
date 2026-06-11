# Front-end

Visión general del cliente Next.js 16 (React 19) y su integración con la plataforma.

## Patrones

- **Feature-Sliced Design (FSD):** capas `app`, `processes`, `entities`, `features`, `widgets` y `shared` para modularidad.
- **Redux Toolkit:** almacena **solo** el estado de autenticación (reducer `auth`); el tema no vive en Redux.
- **React Query:** gestiona el CRUD de flota con query keys, caching e invalidación en cada mutación.

## Experiencia

- Tema **amarillo** claro/oscuro definido en `globals.css` (única fuente de verdad) y aplicado por `ThemeProvider` + `localStorage`; el valor por defecto se configura vía `NEXT_PUBLIC_START_THEME`.
- CRUD estandarizado: `ConfirmDialog` reutilizable en eliminaciones, edición en `Modal` y `SelectField` personalizado (dropdown con portal y teclado).
- Layouts mobile-first con componentes responsivos y feedback consistente.
- Validación basada en esquemas Zod exportados desde el backend.

## Más recursos

- **Frontend y Experiencia**
- **Calidad y Pruebas**
