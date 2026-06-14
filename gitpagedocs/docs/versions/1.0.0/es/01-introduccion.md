# Introducción al Desafío

El assessment técnico de **Aivacol** exige una plataforma completa de gestión de flotas. El repositorio `fleetcore-api` entrega un backend NestJS, un frontend Next.js, infraestructura basada en Docker y documentación operativa, demostrando arquitectura limpia, prácticas de nivel empresarial y orquestación de servicios.

## Objetivos clave

- Exponer APIs REST confiables para crear, leer, actualizar y eliminar **modelos**, **vehículos** y **marcas**.
- Garantizar **seguridad empresarial** (JWT, RBAC, auditoría, traza en MongoDB y mensajería RabbitMQ).
- Ofrecer un **frontend** responsivo construido con el patrón FSD, Redux Toolkit, React Query, Axios y un tema claro/oscuro **amarillo** configurable.
- Empaquetar todo con **Docker Compose**, scripts de automatización, pruebas Jest/Playwright y documentación bilingüe.

## Bloques principales

| Pilar | Descripción | Carpetas/archivos clave |
|-------|-------------|-------------------------|
| Backend API | NestJS 11 + TypeORM (SQL Server), DDD, Unit of Work, eventos de dominio, caché Redis | `backend/src/modules`, `backend/src/shared`, `backend/src/migrations` |
| Mensajería y Auditoría | RabbitMQ para eventos de flota, auditoría enriquecida procesada por el worker `audit-worker` hacia MongoDB | `backend/src/modules/messaging`, `backend/src/modules/audit`, `backend/src/apps/audit-worker` |
| Seguridad | JWT con RBAC, sesiones Redis con TTL deslizante y lock, rate limit dedicado, idempotencia, interceptor de auditoría, sanitización de entrada | `backend/src/modules/auth`, `backend/src/apps/api/security` |
| Frontend | Next.js 16 (App Router), React 19, FSD, Redux Toolkit, React Query, doble tema amarillo claro/oscuro | `frontend/src/app`, `frontend/src/{entities,features,processes,shared,widgets}` |
| Infraestructura | Docker Compose (SQL Server + init, Redis, RabbitMQ, Mongo, API, frontend), Dockerfiles multietapa | `docker-compose.yml`, `envexample.txt` (env único en la raíz), `backend/envexample.txt` |
| Calidad | Pruebas unitarias/de integración/e2e, linting, documentación en GitHub Pages | `backend/tests`, `frontend/tests`, `gitpagedocs/` |

## Estructura de la documentación

Esta wiki se divide en nueve capítulos que cubren todo el desafío:

1. **Introducción al Desafío** – panorama general, componentes y objetivos (esta página).
2. **Requisitos y Criterios** – la checklist completa con enlaces directos a la implementación.
3. **Arquitectura Backend** – módulos, patrones, flujo de datos y resiliencia.
4. **Modelado de Datos y Dominio** – entidades, migraciones y agregados.
5. **Seguridad, Auditoría y Mensajería** – mecanismos de protección y observabilidad.
6. **Frontend y Experiencia** – estructura FSD, flujo de datos en el cliente y UI amarilla responsiva.
7. **Infraestructura y Despliegue** – Docker, variables de entorno, scripts y documentación.
8. **Calidad y Pruebas** – suites unitarias/integración/e2e, linting y puertas de calidad.
9. **Runbook y Resolución de Problemas** – cómo ejecutar el proyecto y manejar fallas.

Usa la navegación “Siguiente/Anterior” o el índice lateral para saltar al tema que necesites.
