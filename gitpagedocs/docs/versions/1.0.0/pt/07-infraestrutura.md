# Infraestrutura e Deployment

O projeto foi pensado para ser executado tanto localmente quanto em ambientes containerizados. A seguir estão os principais componentes de infraestrutura.

## Docker Compose

Arquivo `docker-compose.yml` orquestra todos os serviços obrigatórios:

- `sqlserver`: imagem oficial 2022 Developer, volumes persistentes e senha parametrizável.
- `sqlserver-init`: serviço de inicialização que cria o banco `fleetcore` executando `docker/sqlserver/init.sql`.
- `redis`: modo append-only, usado para cache e sessões.
- `mongo`: armazenamento da trilha de auditoria.
- `rabbitmq`: broker com dashboard (`15672`).
- `backend`: build multistage em `backend/Dockerfile`, expõe `HTTP_PORT` (padrão 3000) e depende de todos os serviços de dados.
- `frontend`: build multistage (`frontend/Dockerfile`) servindo a aplicação Next.js no porto 3001.

## Variáveis de ambiente

- Existe um **único `.env` na raiz**, copiado de `envexample.txt` — consolida as chaves compartilhadas entre backend e frontend (ex.: `SQLSERVER_*`, `JWT_SECRET`, `NEXT_PUBLIC_*`).
- Há também um `backend/envexample.txt` para execução isolada do backend.
- Novos parâmetros relevantes: `AUTH_SESSION_TTL_SECONDS`, `NEXT_PUBLIC_START_THEME`, `REDIS_TTL_SECONDS`.

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm run build` / `npm run start:prod` (backend) | Builda e sobe a API em modo produção.
| `npm run generate:openapi` | Gera artefatos Swagger (JSON) para consumo externo. O Swagger também é servido em `/docs` (EN) e `/docs-pt` (PT) com tema escuro Fleetcore, exemplos bilíngues, Try-it-out e login pré-preenchido.
| `npm run export:schemas` | Exporta schemas Zod do backend para o frontend.
| `npm run dev` (frontend) | Roda Next.js com HMR e integração com API local.
| `npm run lint`, `npm test`, `npm run test:e2e` | Pipelines de qualidade para ambos os projetos.

## Documentação (GitPageDocs)

- A pasta `gitpagedocs/` disponibiliza esta Wiki. O build é estático e é publicado no GitHub Pages pelo workflow `.github/workflows/gitpagedocs-pages.yml` (não há `package.json` na raiz nem script `npm run gitpagedocs`). Publicado em `https://vidigal-code.github.io/fleetcore-api/`.
- Configurações atualizadas para refletir o desafio (idiomas PT/EN, rotas personalizadas).

## Observabilidade e logs

- Logs estruturados via `Logger` do NestJS.
- Auditoria persistida em MongoDB, além de event logs no RabbitMQ.
- Métricas de domínio expostas via `DomainMetricsService` (integração futura com Prometheus/Grafana é simples).

## Deploy recomendado

1. Copiar `envexample.txt` para `.env` na raiz e ajustar segredos.
2. Executar `docker compose up --build`.
3. Acessar `http://localhost:3000/api` (backend), `http://localhost:3000/docs` (Swagger EN), `http://localhost:3000/docs-pt` (Swagger PT-BR) e `http://localhost:3001` (frontend).
4. RabbitMQ UI disponível em `http://localhost:15672` (user `guest`).

Essa infraestrutura cobre todos os requisitos do teste e facilita evolução para ambientes gerenciados (Kubernetes, ECS, etc.) caso necessário.
