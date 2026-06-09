# Front-end

Visión general del cliente Next.js y su integración con la plataforma.

## Patrones

- **Feature-Sliced Design (FSD):** capas `entities`, `features`, `widgets`, `processes` y `shared` para modularidad.
- **Redux Toolkit:** almacena estado de autenticación y preferencias.
- **React Query:** gestiona peticiones REST con caching y reintentos controlados.

## Experiencia

- Temas naranja claro/oscuro configurables vía `NEXT_PUBLIC_START_THEME`.
- Layouts mobile-first con componentes responsivos y feedback consistente.
- Validación basada en esquemas Zod exportados desde el backend.

## Más recursos

- [Frontend y Experiencia](./06-frontend.md)
- [Calidad y Pruebas](./08-calidad-pruebas.md)
