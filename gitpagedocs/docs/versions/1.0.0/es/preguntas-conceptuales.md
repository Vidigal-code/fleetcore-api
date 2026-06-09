# Preguntas Conceptuales

Respuestas breves a dudas frecuentes durante la revisión técnica.

## ¿Por qué usar DDD y módulos aislados?

Mantiene contextos delimitados, facilita pruebas y permite escalar capacidades (flota, auth, auditoría, mensajería) sin efectos colaterales. Consulta [Arquitectura Backend](./03-arquitectura-backend.md).

## ¿Cómo se revocan sesiones sin invalidar todos los tokens?

`AuthSessionService` guarda identificadores de sesión en Redis con TTL y los elimina al hacer logout, de modo que los guards rechazan tokens caducados. Más detalles en [Seguridad, Auditoría y Mensajería](./05-seguridad-auditoria-mensajeria.md).

## ¿Cómo comparten validaciones el frontend y el backend?

Los esquemas Zod se generan en el backend (`npm run export:schemas`) y se importan en el FSD para mensajes consistentes. Revisa [Frontend y Experiencia](./06-frontend.md).

## ¿Qué habilita la observabilidad?

Logging estructurado, auditoría en MongoDB, eventos RabbitMQ y métricas de dominio permiten investigar incidentes y crear alertas. Amplía en [Calidad y Pruebas](./08-calidad-pruebas.md).
