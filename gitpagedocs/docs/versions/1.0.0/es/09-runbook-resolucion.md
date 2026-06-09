# Runbook y Resolución de Problemas

## 1. Preparar variables de entorno

```bash
cp .env.example .env
```

Configuraciones clave:

- Credenciales `SQLSERVER_*`
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS`
- `RABBITMQ_URI`, `MONGO_URI`, `REDIS_*`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_START_THEME`

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
| Respuestas `401 Unauthorized` | Genera un nuevo token vía `/auth/login` y verifica que Redis esté corriendo (`AUTH_SESSION_TTL_SECONDS`). |
| Documentos de auditoría faltantes | Inspecciona los logs de `AuditService`; si RabbitMQ cae, el fallback escribe directamente en MongoDB. |
| Caché que no se invalida | Asegúrate de que el toggle `repositoryCache` esté habilitado (`FEATURE_FLAGS`). |
| Tema siempre claro | Define `NEXT_PUBLIC_START_THEME=dark` y limpia el `localStorage` (`fleetcore.theme-preference`). |

## 6. Referencias útiles

- Documentación Swagger (EN/PT).
- Scripts del proyecto (`package.json`).
- Esta base de conocimiento en GitPageDocs.

Sigue estos pasos para levantar, validar y solucionar problemas de la plataforma de gestión de flotas de extremo a extremo.
