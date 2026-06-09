# Guia de Execução e Troubleshooting

## 1. Preparar variáveis de ambiente

```bash
cp .env.example .env
```

Ajuste, se necessário:

- `SQLSERVER_*` (credenciais e base)
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_SESSION_TTL_SECONDS`
- `RABBITMQ_URI`, `MONGO_URI`, `REDIS_*`
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
| `401 Unauthorized` nas rotas | Confirme se o token foi gerado via `/auth/login` e se a sessão Redis está ativa (`AUTH_SESSION_TTL_SECONDS`). |
| Auditoria não aparece no Mongo | Verifique logs do `AuditService`; se RabbitMQ estiver indisponível, o fallback escreve diretamente no Mongo. |
| Cache não invalida após edição | Cheque se a flag `repositoryCache` está habilitada (`FEATURE_FLAGS` no `.env`). |
| Tema não inicia em dark | Use `NEXT_PUBLIC_START_THEME=dark` e limpe `localStorage` (`fleetcore.theme-preference`). |

## 6. Recursos adicionais

- Documentação Swagger (EN/PT).
- Scripts `package.json` em backend/frontend para lint, build e testes.
- Este GitPageDocs com detalhes de arquitetura e requisitos.

Com esses passos, você consegue levantar, validar e depurar todo o ecossistema da plataforma de gestão de frota.
