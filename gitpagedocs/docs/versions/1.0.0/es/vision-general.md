# Visión General del Proyecto

Resumen rápido de la plataforma de gestión de flotas antes de recorrer los capítulos completos.

## Propósito

Entregar un stack integral (backend, frontend, infraestructura y documentación) que demuestre cumplimiento total del desafío de Aivacol.

## Pilares

- **Arquitectura** — módulos, capas y entidades descritos en las secciones Arquitectura Backend y Modelado de Datos y Dominio del menú.
- **Seguridad y observabilidad** — RBAC, sesiones Redis con TTL deslizante y lock, rate limit dedicado, idempotencia, auditoría enriquecida y eventos RabbitMQ explicados en Seguridad, Auditoría y Mensajería.
- **Experiencia digital** — patrón FSD, tema amarillo y flujo de datos abordados en Frontend y Experiencia.
- **Calidad y operaciones** — rutinas de QA y soporte documentadas en Calidad y Pruebas y Runbook y Resolución de Problemas.

## Resultados

- APIs NestJS con DDD, caché Redis, lock distribuido, rate limit, idempotencia y eventos RabbitMQ.
- Frontend Next.js responsivo que comparte esquemas Zod con el backend.
- Stack Docker Compose con SQL Server, Redis, RabbitMQ, MongoDB y el worker `audit-worker`.
- Sitio GitPageDocs trilingüe alineado con el desafío.

Usa el menú para saltar al tema de tu interés.
