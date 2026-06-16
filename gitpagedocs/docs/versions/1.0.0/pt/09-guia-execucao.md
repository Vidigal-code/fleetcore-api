# Guia de Execução e Troubleshooting

## 1. Preparar variáveis de ambiente

```bash
cp envexample.txt .env
```

Ajuste, se necessário:

- `SQLSERVER_*` (credenciais e base)
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS`
- `RABBITMQ_URI`, `MONGO_URI`, `REDIS_*`, `REDIS_LOCK_TTL`
- `WORKER_CONCURRENCY`, `RABBITMQ_RETRY_QUEUE`, `RABBITMQ_DLQ`, `RABBITMQ_RETRY_DELAY_MS`, `RABBITMQ_AUDIT_MAX_ATTEMPTS`, `RETRY_MAX_ATTEMPTS`, `RETRY_INITIAL_DELAY`
- `AUDIT_OUTBOX_RELAY_INTERVAL_MS`, `AUDIT_OUTBOX_BATCH_SIZE`, `AUDIT_OUTBOX_MAX_ATTEMPTS`
- `RATE_LIMIT_ENABLED`, `RATE_LIMIT_WINDOW_SECONDS`, `RATE_LIMIT_MAX_REQUESTS`, `RATE_LIMIT_AUTH_MAX_REQUESTS`, `RATE_LIMIT_AUTH_WINDOW_SECONDS`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_START_THEME`

## 2. Subir stack com Docker

```bash
docker compose up --build
```

Serviços expostos:

- Backend API: `http://localhost:3000/api`
- Swagger EN: `http://localhost:3000/docs`
- Swagger PT-BR: `http://localhost:3000/docs-pt`
- Frontend: `http://localhost:3001`
- RabbitMQ UI: `http://localhost:15672`

O serviço `audit-worker` sobe junto com a stack (mesma imagem do backend) e consome a fila `fleetcore.audit`; confirme no log do container a linha com a concurrency configurada (`WORKER_CONCURRENCY`).

Usuário seed: `aivacol` / `aivacol123!`

## 3. Execução manual (sem Docker)

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

Certifique-se de ter SQL Server, Redis, RabbitMQ e MongoDB rodando localmente ou via serviços gerenciados.

## 4. Comandos de manutenção

- `npm run generate:openapi` (backend): atualiza artefatos Swagger e cliente TypeScript.
- `npm run export:schemas` (backend): exporta schemas Zod para o frontend.
- `npm run lint`, `npm test`, `npm run test:e2e` (ambos): pipelines de verificação.

## 5. Troubleshooting

| Sintoma | Ação sugerida |
|---------|---------------|
| Erro ao conectar no SQL Server | Verifique `SQLSERVER_*` no `.env` e se o container `sqlserver` está saudável (`docker compose ps`). |
| `401 Unauthorized` nas rotas | Confirme se o token foi gerado via `/auth/login`, se a sessão Redis está ativa (TTL renovado a cada requisição) e se a sessão não foi **bloqueada** (`isLocked`). |
| `429 Rate limit exceeded` | Esperado ao exceder os limites (`RATE_LIMIT_*`); aguarde `retryAfter` segundos ou ajuste os limites. `POST /auth/login` é mais restrito (10/60s). |
| `409 Conflict` em mutações | Requisição duplicada com o mesmo header `Idempotency-Key`; reenvie sem repetir a chave já usada. |
| Auditoria não aparece no Mongo | Verifique se o serviço `audit-worker` está de pé consumindo `fleetcore.audit`; se o RabbitMQ estiver fora, os eventos vão para a coleção `audit_outbox` e o `AuditOutboxRelayService` republica quando o broker volta; se o Mongo falhar no consumo, o consumer faz retry via `fleetcore.retry` e parqueia em `fleetcore.dead-letter`. A escrita síncrona direta no Mongo é só a última rede de segurança. |
| Cache não invalida após edição | Cheque se a flag `repositoryCache` está habilitada (`FEATURE_FLAGS` no `.env`). |
| Tema não inicia em dark | Use `NEXT_PUBLIC_START_THEME=dark` e limpe `localStorage` (`fleetcore.theme-preference`). |

## 6. Recursos adicionais

- Documentação Swagger (EN/PT).
- Scripts `package.json` em backend/frontend para lint, build e testes.
- Este GitPageDocs com detalhes de arquitetura e requisitos.

Com esses passos, você consegue levantar, validar e depurar todo o ecossistema da plataforma de gestão de frota.
