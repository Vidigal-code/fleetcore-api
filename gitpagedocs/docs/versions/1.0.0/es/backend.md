# Back-end

Referencia rápida de la API NestJS, sus reglas de negocio y mecanismos de soporte.

## Endpoints clave

- CRUD de marcas, modelos y vehículos en `fleet/interfaces/http`.
- Rutas de autenticación (`/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me`).
- Swagger disponible en `/docs` (EN) y `/docs-pt` (PT-BR).

## Reglas de negocio

- Servicios (`models.service.ts`, `vehicles.service.ts`) validan relaciones y emiten eventos de dominio.
- Caché Redis acelera búsquedas e invalida automáticamente após mutaciones.
- RabbitMQ transmite cambios significativos a consumidores downstream.

## Profundiza

- **Arquitectura Backend**
- **Modelado de Datos y Dominio**
- **Seguridad, Auditoría y Mensajería**
