# Plataforma de Gestión de Flotas · Aivacol

Este espacio documenta de forma transparente la solución entregada para el desafío técnico de Aivacol. Sirve como referencia rápida para revisar decisiones, localizar requisitos y operar la plataforma.

## Cómo navegar

- **Introducción al Desafío** — visión general del producto, objetivos y entregables.
- **Requisitos y Criterios** — checklist completa del enunciado y dónde se cumple cada ítem.
- **Arquitectura Backend** — módulos NestJS, capas DDD y mecanismos de resiliencia.
- **Modelado de Datos y Dominio** — entidades, migraciones y relaciones entre tablas.
- **Seguridad, Auditoría y Mensajería** — JWT, RBAC, Redis, RabbitMQ y trazas en MongoDB.
- **Frontend y Experiencia** — Next.js FSD, React Query, Redux Toolkit y diseño naranja responsivo.
- **Infraestructura y Despliegue** — Docker Compose, variables de entorno, scripts y documentación.
- **Calidad y Pruebas** — matriz de tests unitarios/integrados/e2e, linting y monitoreo.
- **Runbook y Resolución de Problemas** — pasos para levantar ambientes y resolver fallas.

## Stack a alto nivel

- **Backend:** NestJS 11, TypeORM, SQL Server, Redis, RabbitMQ, MongoDB, Zod.
- **Frontend:** Next.js 14 (App Router), Redux Toolkit, React Query, Axios, Tailwind, Playwright.
- **Infraestructura:** Docker Compose, scripts npm, GitHub Pages alimentado por GitPageDocs.

Cada sección profundiza en su tema y apunta a rutas y comandos relevantes dentro del repositorio.

> Versión: 1.0.0
