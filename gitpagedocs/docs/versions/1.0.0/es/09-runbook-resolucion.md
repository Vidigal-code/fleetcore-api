# Runbook y Resolución de Problemas

## 1. Preparar variables de entorno

```bash
cp envexample.txt .env
```

Configuraciones clave:

- Credenciales `SQLSERVER_*`
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS`
- `RABBITMQ_URI`, `MONGO_URI`, `REDIS_*`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_START_THEME`
- Lock distribuido: `REDIS_LOCK_TTL`
- Worker de auditoría: `WORKER_CONCURRENCY`, `RABBITMQ_RETRY_QUEUE`, `RABBITMQ_DLQ`
- Rate limit: `RATE_LIMIT_ENABLED`, `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_AUTH_MAX_REQUESTS`, `RATE_LIMIT_AUTH_WINDOW_SECONDS`
- Reintentos: `RETRY_MAX_ATTEMPTS`, `RETRY_INITIAL_DELAY`

## 2. Levantar el stack Docker

```bash
docker compose up --build
```

Servicios disponibles:

- API: `http://localhost:3000/api`
- Swagger EN: `http://localhost:3000/docs`
- Swagger PT-BR: `http://localhost:3000/docs-pt`
- Frontend: `http://localhost:3001`
- RabbitMQ UI: `http://localhost:15672`

Además del `backend`, el stack levanta el servicio `audit-worker` (consumidor de `fleetcore.audit`). Verifica en sus logs la concurrency registrada al arranque (`WORKER_CONCURRENCY`) y, en la UI de RabbitMQ, la actividad de la cola `fleetcore.audit`.

Seed admin: `aivacol` / `aivacol123!`

## 3. Ejecución manual (sin Docker)

```bash
# Backend
cd backend
npm install
npm run build
npm run start:prod

# Frontend
cd frontend
npm install
npm run dev
```

Asegúrate de que SQL Server, Redis, RabbitMQ y MongoDB estén disponibles localmente o como servicios administrados.

## 4. Comandos de mantenimiento

- `npm run generate:openapi` — refresca los archivos Swagger JSON.
- `npm run export:schemas` — regenera los esquemas Zod compartidos.
- `npm run lint`, `npm test`, `npm run test:e2e` — aplican las puertas de calidad.

## 5. Troubleshooting

| Síntoma | Acción sugerida |
|---------|-----------------|
| Errores de conexión a SQL Server | Confirma `SQLSERVER_*` en `.env` y revisa la salud de los contenedores (`docker compose ps`). |
| Respuestas `401 Unauthorized` | Genera un nuevo token vía `/auth/login` y verifica que Redis esté corriendo (`AUTH_SESSION_TTL_SECONDS`). Si la sesión está **bloqueada** (`isLocked`), desbloquéala o reautentica; el TTL se renueva en cada petición válida. |
| Respuestas `429 Too Many Requests` | Se alcanzó el rate limit (`{ "success": false, "message": "Rate limit exceeded", "retryAfter": <s> }`). Espera `retryAfter` o ajusta `RATE_LIMIT_*`; recuerda que `POST /auth/login` está limitado a 10/60 s. Los bloqueos se auditan como `rate_limit.blocked`. |
| Respuestas `409 Conflict` en mutaciones | El header `Idempotency-Key` se repitió y `IdempotencyInterceptor` detectó un duplicado. Usa una clave nueva por operación. |
| Documentos de auditoría faltantes | Verifica que el servicio `audit-worker` esté arriba y consumiendo `fleetcore.audit`; revisa los logs del worker y, si RabbitMQ cae, el fallback de `ResilienceService` escribe directamente en MongoDB. |
| Bloqueos/deadlocks aparentes en operaciones críticas | Revisa el lock distribuido (`RedisLockService`); los locks expiran por `REDIS_LOCK_TTL` y solo el token dueño puede liberarlos. |
| Caché que no se invalida | Asegúrate de que el toggle `repositoryCache` esté habilitado (`FEATURE_FLAGS`). |
| Tema siempre claro | Define `NEXT_PUBLIC_START_THEME=dark` y limpia el `localStorage` (`fleetcore.theme-preference`). |

## 6. Referencias útiles

- Documentación Swagger (EN/PT): tema oscuro Fleetcore, "Try it out" habilitado, ejemplos bilingües y `POST /auth/login` precargado con las credenciales seed.
- Scripts del proyecto en los `package.json` de `backend/` y `frontend/` (no hay `package.json` en la raíz).
- Esta base de conocimiento en GitPageDocs (publicada por el workflow de GitHub Actions).

Sigue estos pasos para levantar, validar y solucionar problemas de la plataforma de gestión de flotas de extremo a extremo.
