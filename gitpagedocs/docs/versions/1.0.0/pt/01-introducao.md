# Introdução ao Desafio

O desafio de gestão de frotas da Aivacol solicita uma plataforma pronta para produção que una backend, frontend, integrações assíncronas e documentação. O repositório `fleetcore-api` entrega:

- **Backend**: NestJS 11, TypeORM (SQL Server), cache Redis, mensageria RabbitMQ e trilha de auditoria em MongoDB.
- **Frontend**: Next.js 14 (App Router) estruturado com o padrão Feature-Sliced Design, Redux Toolkit e React Query.
- **Infraestrutura**: Docker Compose para todos os serviços, seeds iniciais, scripts npm e templates de ambiente.
- **Qualidade & Operações**: testes automatizados, políticas de resiliência, Swagger PT/EN e GitPagedocs bilíngue.

## Entregáveis em destaque

| Entregável | Descrição | Código-fonte |
|------------|-----------|--------------|
| REST API | CRUD de marcas, modelos e veículos, gestão de sessões, worker de auditoria | `backend/src/modules`, `backend/src/apps` |
| Mensageria & auditoria | Publicação/consumo RabbitMQ, writer MongoDB, wrappers de resiliência | `backend/src/modules/messaging`, `backend/src/modules/audit` |
| Web client | Layout FSD, shell autenticado, dashboards da frota, schemas compartilhados | `frontend/src/app`, `frontend/src/{entities,features,processes,widgets,shared}` |
| Documentação & tooling | Site GitPagedocs, builders Swagger, exportação de schemas | `gitpagedocs/`, scripts em `backend/package.json` |
| Infraestrutura | Compose stack, variáveis `.env`, dataset seed | `docker-compose.yml`, `.env.example`, `backend/src/apps/api/app-bootstrap.service.ts`, `backend/seeds` |

## Estrutura do repositório (recorte)

```text
backend/
  src/
    apps/
      api/                # Bootstrap HTTP, guards, Swagger
      audit-worker/       # Worker assíncrono para fallback de auditoria
    modules/
      auth/
      fleet/
      audit/
      messaging/
      users/
    shared/               # Configuração, cache, unit of work, resiliência, validação
frontend/
  src/
    app/
    entities/, features/, widgets/, processes/, shared/
gitpagedocs/
```

## Como navegar

Os capítulos seguem a mesma ordem do menu superior. Cada seção resume a capacidade e indica os arquivos relevantes no repositório.

1. **Introdução ao Desafio** – contexto, entregáveis e layout geral (esta página).
2. **Requisitos e Critérios** – rastreabilidade entre checklist e código.
3. **Arquitetura Backend** – limites de módulos, fluxos e serviços de apoio.
4. **Modelagem de Dados e Domínio** – agregados, migrations e contratos de repositório.
5. **Segurança, Auditoria e Mensageria** – autenticação, trilha e RabbitMQ.
6. **Frontend e Experiência** – slices FSD, gestão de estado e temas.
7. **Infraestrutura e Deployment** – imagens Docker, variáveis de ambiente e scripts.
8. **Qualidade e Testes** – suites automatizadas, lint e resiliência.
9. **Guia de Execução e Troubleshooting** – comandos e orientações operacionais.

Use o menu superior ou os botões “Próximo/Anterior” para acessar rapidamente o tópico desejado.
